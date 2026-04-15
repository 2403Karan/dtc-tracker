import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Stop() {
  const [stopName, setStopName] = useState("");
  const [stopId, setStopId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    proceedButton();
  };

  const proceedButton = () => {
    if (stopId !== "" && stopId !== null && stopId !== undefined) {
      navigate(`/stop/${stopId}`, {
        state: {
          stop: stopName,
        },
      });
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setStopName(value);
    setStopId("");

    if (value.length > 1) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://127.0.0.1:8000/dtc_tracker/stop?stopName=${value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setStopName(suggestion.stop_name);
    setStopId(suggestion.stop_id);
    setShowSuggestions(false);

    navigate(`/stop/${suggestion.stop_id}`, {
      state: {
        stop: suggestion.stop_name,
      },
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <NavLink className="navbar-brand fw-bold mx-auto" to="/">
          Stop Enquiry
        </NavLink>
      </nav>

      {/* Main Content */}
      <div className="d-flex align-items-center justify-content-center flex-grow-1 py-5">
        <div
          className="card border-0 shadow-lg p-4 w-100"
          style={{ maxWidth: "500px", borderRadius: "16px" }}
        >
          <div className="card-body">
            <h1 className="text-center fw-bold text-dark mb-3">
              Check Stop Info
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 position-relative">
                <label htmlFor="stopNo" className="form-label fw-semibold">
                  Stop Name
                </label>
                <input
                  type="text"
                  id="stopNo"
                  placeholder="Enter Stop Name"
                  value={stopName}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  autoComplete="off"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 z-3 shadow-sm"
                    style={{
                      top: "100%",
                      left: 0,
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    {suggestions.slice(0, 3).map((s, index) => (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action p-3"
                        tabIndex={0}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#fff",
                        }}
                        onClick={() => handleSuggestionClick(s)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSuggestionClick(s);
                        }}
                      >
                        <strong>{s.stop_name}</strong>
                        <small className="text-muted"> ({s.stop_id})</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 btn-lg mt-3">
                Get Stop Details
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Stop;