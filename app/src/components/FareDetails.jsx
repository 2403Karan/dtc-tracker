import { useState, useEffect } from "react";
import {
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function FareDetails() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("from");
  const destination = searchParams.get("to");
  const location = useLocation();
  const navigate = useNavigate();

  const { sourceName, destinationName } = location.state || {};
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (routeId, routeName) => {
    if (source && destination) {
      navigate(
        `/routeDetails?fromStopId=${source}&toStopId=${destination}&routeId=${routeId}`,
        {
          state: {
            sourceName,
            destinationName,
            routeId,
            routeName,
          },
        }
      );
    }
  };

  useEffect(() => {
    if (!source || !destination) return;

    const fetchFareDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `http://127.0.0.1:8000/dtc_tracker/fare?from=${source}&to=${destination}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        setError("Error fetching fare details. Please try again.");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFareDetails();
  }, [source, destination]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid justify-content-center">
          <span className="navbar-brand fw-bold">Fare Details</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4 flex-grow-1">
        {/* Header Card */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body text-center">
            <p className="mb-1 text-muted">
              <strong>From:</strong> {sourceName || "N/A"}
            </p>
            <p className="mb-0 text-muted">
              <strong>To:</strong> {destinationName || "N/A"}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center mt-4">
            <p className="text-primary mb-0">Loading fare details...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && data.length > 0 && (
          <div className="card border-0 shadow-sm">
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
                    <th className="px-4 py-3">Route Name</th>
                    <th className="px-4 py-3">Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          title="Click to view route details"
                          onClick={() =>
                            handleSubmit(item.route_id, item.route_name)
                          }
                        >
                          {item.route_name}
                        </button>
                      </td>
                      <td className="px-4 py-3 fw-semibold">₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <p className="text-muted mb-0">
                No fare details found for this route.
              </p>
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

export default FareDetails;