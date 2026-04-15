import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function StopTimings() {
  const { stopNo } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { stop } = location.state || {};

  const handleSubmit = (tripId, routeName) => {
    if (tripId && routeName) {
      navigate(`/trip/${tripId}/schedule`, {
        state: { routeName },
      });
    }
  };

  useEffect(() => {
    if (!stopNo) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://127.0.0.1:8000/dtc_tracker/stop/${stopNo}/timing`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Error fetching data, please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stopNo]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid justify-content-center">
          <span className="navbar-brand fw-bold">Stop Details</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4 flex-grow-1">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body text-center">
            <p className="mb-0 text-muted">
              <strong>Stop Name:</strong> {stop || "Selected Stop"}
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center mt-4">
            <p className="text-primary mb-0">Loading bus information...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="card border-0 shadow-sm">
            <div
              className="table-responsive"
              style={{ maxHeight: "380px", overflowY: "auto" }}
            >
              <table className="table table-hover mb-0">
                <thead
                  className="table-dark"
                  style={{ position: "sticky", top: 0, zIndex: 1 }}
                >
                  <tr>
                    <th className="px-4 py-3">Trip ID</th>
                    <th className="px-4 py-3">Route Name</th>
                    <th className="px-4 py-3">Arrival Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() =>
                            handleSubmit(item.trip_id, item.route_name)
                          }
                        >
                          {item.trip_id}
                        </button>
                      </td>
                      <td className="px-4 py-3">{item.route_name}</td>
                      <td className="px-4 py-3">{item.arrival_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <p className="text-muted mb-0">No buses found at {stop}</p>
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

export default StopTimings;