import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function RouteDetails() {
  const [events, setEvents] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // 1. New states added to store the exact coordinates from backend
  const [startCoords, setStartCoords] = useState("");
  const [endCoords, setEndCoords] = useState("");
  
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { sourceName, destinationName } = location.state || {};

  const source = searchParams.get("fromStopId");
  const destination = searchParams.get("toStopId");
  const route = searchParams.get("routeId");

  const key = "AIzaSyDeW_X7K8Vlwb1MLe6pWtfFiqPKTghoZlw";

  useEffect(() => {
    if (!source || !destination || !route) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [routeRes, dirRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/dtc_tracker/route`, {
            params: { fromStopId: source, toStopId: destination, routeId: route },
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://127.0.0.1:8000/dtc_tracker/distancetime`, {
            params: { fromStopId: source, toStopId: destination },
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const routeData = routeRes.data || [];
        setEvents(routeData);

        // distance & duration
        setDistance(dirRes.data.distance || "");
        setDuration(dirRes.data.duration || "");

        // 2. Extract and update coordinates fetched from backend
        setStartCoords(dirRes.data.start_name.stop_lat + "," + dirRes.data.start_name.stop_long || "");
        setEndCoords(dirRes.data.end_name.stop_lat + "," + dirRes.data.end_name.stop_long || "");

        // start & end time
        if (routeData.length > 0) {
          const start = routeData[0].departure_time || routeData[0].arrival_time;
          const end = routeData[routeData.length - 1].arrival_time;

          setStartTime(start);
          setEndTime(end);
        }
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [source, destination, route]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid justify-content-center">
          <span className="navbar-brand fw-bold">Route Details</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-3 flex-grow-1">

        {/* Header Card */}
        <div className="card border-0 shadow-sm mb-2">
          <div className="card-body text-center">
            <p className="mb-1 text-muted">
              <strong>From:</strong> {sourceName}
            </p>
            <p className="mb-1 text-muted">
              <strong>To:</strong> {destinationName}
            </p>
          </div>
        </div>

        {/* Summary */}
        {!loading && events.length > 0 && (
          <div className="row g-3 mb-2">
            <div className="col-md-3">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                  <small className="fw-bold mb-0">Distance</small>
                  <p className="mb-0">{distance}</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                  <small className="fw-bold mb-0">Duration</small>
                  <p className="mb-0">{duration}</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                  <small className="fw-bold mb-0">Start</small>
                  <p className="mb-0">{startTime}</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                  <small className="fw-bold mb-0">End</small>
                  <p className="mb-0">{endTime}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center mt-2">
            <p className="text-primary">Loading route details...</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="row g-4">

            {/* Map Column */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm" style={{ height: "300px" }}>
                <div className="card-body p-0 h-100">
                  <iframe
                    title="Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    /* 3. Uses startCoords and endCoords if available, falls back to text names while loading */
                    src={`https://www.google.com/maps/embed/v1/directions?key=${key}&origin=${encodeURIComponent(
                      startCoords 
                    )}&destination=${encodeURIComponent(endCoords )}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Timeline Column */}
            <div className="col-lg-6">
              <div
                className="card border-0 shadow-sm"
                style={{ height: "300px" }}
              >
                <div
                  className="card-body"
                  style={{ overflowY: "auto" }}
                >
                  <ul className="list-unstyled mb-0">
                    {events.map((point, index) => (
                      <li
                        key={index}
                        className="d-flex align-items-start mb-3"
                      >
                        {/* Timeline Line + Dot */}
                        <div
                          className="d-flex flex-column align-items-center"
                          style={{ width: "30px" }}
                        >
                          <div
                            className="bg-primary rounded-circle"
                            style={{ width: "10px", height: "10px" }}
                          ></div>

                          {index < events.length - 1 && (
                            <div
                              className="bg-primary"
                              style={{
                                width: "2px",
                                flexGrow: 1,
                                marginTop: "2px",
                              }}
                            ></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="ms-3">
                          <div className="fw-semibold">
                            {point.stop_name}
                          </div>
                          <small className="text-muted">
                            {point.arrival_time}
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <p className="text-muted">No route data available.</p>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2026 DTC System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default RouteDetails;