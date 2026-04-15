import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function TripDetails() {
  const { tripId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originStop, setOriginStop] = useState("");
  const [destinationStop, setDestinationStop] = useState("");

  const location = useLocation();
  const { routeName } = location.state || {};

  const key = "AIzaSyDeW_X7K8Vlwb1MLe6pWtfFiqPKTghoZlw";

  useEffect(() => {
    if (!tripId) return;

    const fetchTripDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://127.0.0.1:8000/dtc_tracker/trip/${tripId}/schedule`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = Array.isArray(response.data) ? response.data : [];
        setData(result);

        if (result.length > 0) {
          setOriginStop(result[0].stop_name);
          setDestinationStop(result[result.length - 1].stop_name);
        } else {
          setOriginStop("");
          setDestinationStop("");
        }
      } catch (err) {
        setError("Error fetching data, please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid justify-content-center">
          <span className="navbar-brand fw-bold">Trip Details</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-2 flex-grow-1">
        {/* Header */}
        <div className="card border-0 shadow-sm mb-2">
          <div className="card-body text-center">
            <p className="mb-1">
              <strong>Trip Number:</strong> {tripId}({routeName})
            </p>
          </div>
        </div>

        {/* Origin / Destination */}
        {!loading && !error && data.length > 0 && (
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Origin Stop</h6>
                  <p className="fw-semibold mb-0">{originStop}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Destination Stop</h6>
                  <p className="fw-semibold mb-0">{destinationStop}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center mt-4">
            <p className="text-primary mb-0">Loading bus schedule...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="row g-4">
            {/* Map */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm" style={{ height: "350px" }}>
                <div className="card-body p-0 h-100">
                  <iframe
                    title="Trip Route Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(
                      key
                    )}&origin=${encodeURIComponent(
                      originStop
                    )}&destination=${encodeURIComponent(
                      destinationStop
                    )}&mode=driving`}
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm" style={{ height: "350px" }}>
                <div
                  className="table-responsive"
                  style={{ maxHeight: "350px", overflowY: "auto" }}
                >
                  <table className="table table-hover mb-0">
                    <thead
                      className="table-dark"
                      style={{ position: "sticky", top: 0, zIndex: 1 }}
                    >
                      <tr>
                        <th className="px-2 py-1">Arrival Time</th>
                        <th className="px-2 py-1">Stop Name</th>
                        <th className="px-2 py-1">Departure Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td className="px-2 py-2">{item.arrival_time}</td>
                          <td className="px-2 py-2">{item.stop_name}</td>
                          <td className="px-2 py-2">{item.departure_time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <p className="text-muted mb-0">No schedule available for this trip.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TripDetails;