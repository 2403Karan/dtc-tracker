import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useSearchParams, NavLink ,useLocation} from 'react-router-dom';

function RouteDetails() {
  const [events, setEvents] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [searchParams] = useSearchParams();
  const location= useLocation();
  const { sourceName, destinationName } = location.state || {};
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const source = searchParams.get("fromStopId");
  const destination = searchParams.get("toStopId");
  const route = searchParams.get("routeId");
  const key="AIzaSyDeW_X7K8Vlwb1MLe6pWtfFiqPKTghoZlw";

useEffect(() => {
  const fetchAllData = async () => {
    if (!source || !destination || !route) return;

    try {
      const [routeRes, dirRes] = await Promise.all([
        axios.get(`http://127.0.0.1:5000/dtc_tracker/route`, {
          params: { fromStopId: source, toStopId: destination, routeId: route }
        }),
        axios.get(`http://127.0.0.1:5000/dtc_tracker/distancetime`, {
          params: { fromStopId: source, toStopId: destination }
        })
      ]);

      const routeData = routeRes.data || [];
      if (routeData.length === 0) {
        setEvents([]);
        return;
      }

      const formattedEvents = routeData.map((item, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === routeData.length - 1;
        return {
          location: item.stop_name + (isFirst ? " (Source)" : isLast ? " (Destination)" : ""),
          arrival_time: item.arrival_time
        };
      });

      const sourceTime = routeData[0].departure_time || routeData[0].arrival_time;
      const [h, m] = sourceTime.split(":").map(Number);
      const startDate = new Date();
      startDate.setHours(h, m, 0, 0);

      const durationStr = dirRes.data.duration || "";
      let totalMinutes = 0;
      const hourMatch = durationStr.match(/(\d+)\s*hr[s]?/i);
      const minMatch = durationStr.match(/(\d+)\s*min[s]?/i);
      if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60;
      if (minMatch) totalMinutes += parseInt(minMatch[1], 10);

      const endDate = new Date(startDate.getTime() + totalMinutes * 60 * 1000);
      const formatTime = date =>
        `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

      setEvents(formattedEvents);
      setStartTime(formatTime(startDate));
      setEndTime(formatTime(endDate));
      setDistance(dirRes.data.distance || "");
      setDuration(durationStr);

    } catch (err) {
      console.error("Error fetching route/distance:", err);
      setEvents([]);
    }
  };

  fetchAllData();
}, [source, destination, route]);

return (
  <div className="d-flex flex-column min-vh-100">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <NavLink className="navbar-brand fw-bold" to="/">DTC Tracker</NavLink>
    </nav>

    <div className="container mt-3">
      <h1 className="fw-bold mb-4 text-center">Route Details</h1>

      {(!events.length || !distance || !duration) ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <p className="text-muted fs-5">No route data available.</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-3">
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <div className="border rounded p-2">Total Distance : <b>{distance}</b></div>
              <div className="border rounded p-2">Total Journey Time: <b>{duration}</b></div>
              <div className="border rounded p-2">Journey Starts: <b>{startTime}</b></div>
              <div className="border rounded p-2">Journey Ends: <b>{endTime}</b></div>
            </div>
          </div>

          <div className="row">
            {/* Map */}
            <div className="col-md-6">
              <div style={{ width: "100%", height: "300px" }}>
                <iframe
                  title="Google Maps Directions"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(key)}&origin=${encodeURIComponent(sourceName)}&destination=${encodeURIComponent(destinationName)}&mode=driving`}
                ></iframe>
              </div>
            </div>

            {/* Timeline */}
            <div className="col-md-6">
              <ul className="list-unstyled ps-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {events.map((point, index) => (
                  <li key={index} className="d-flex align-items-start mb-4 position-relative">
                    <div className="d-flex flex-column align-items-center" style={{ width: "40px" }}>
                      <div className="bg-primary rounded-circle" style={{ width: "15px", height: "15px" }}></div>
                      {index < events.length - 1 && (
                        <div className="bg-primary" style={{ width: "2px", flexGrow: 1 }}></div>
                      )}
                    </div>
                    <div className="ps-3">
                      <h6>{point.location}</h6>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>

    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
  </div>
);
}
export default RouteDetails;