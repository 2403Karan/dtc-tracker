import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Price() {
  const [source, setSource] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [possibleStops, setPossibleStops] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sourceId && destinationId) {
      navigate(`/fareCharges?from=${sourceId}&to=${destinationId}`, {
        state: {
          sourceName: source,
          destinationName: destination,
        },
      });
    }
  };

  const fetchSuggestions = async (value, isSource) => {
    if (value.length > 1) {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/dtc_tracker/stop?stopName=${value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (isSource) {
          setSourceSuggestions(res.data || []);
          setShowSourceSuggestions(true);
        } else {
          setDestSuggestions(res.data || []);
          setShowDestSuggestions(true);
        }
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    } else {
      if (isSource) {
        setSourceSuggestions([]);
        setShowSourceSuggestions(false);
      } else {
        setDestSuggestions([]);
        setShowDestSuggestions(false);
      }
    }
  };

  const fetchPossibleStops = async (stopId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/dtc_tracker/fare?from=${stopId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPossibleStops(res.data || []);
    } catch (err) {
      console.error("Error fetching possible stops:", err);
      setPossibleStops([]);
    }
  };

  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    setSourceId("");
    setDestination("");
    setDestinationId("");
    setDestSuggestions([]);
    setShowDestSuggestions(false);
    fetchSuggestions(value, true);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setDestinationId("");

    if (value.length > 1 && possibleStops.length > 0) {
      const filtered = possibleStops.filter((s) =>
        s.stop_name.toLowerCase().includes(value.toLowerCase())
      );
      setDestSuggestions(filtered);
      setShowDestSuggestions(true);
    } else {
      setDestSuggestions([]);
      setShowDestSuggestions(false);
    }
  };

  const handleSourceSuggestionClick = (s) => {
    setSource(s.stop_name);
    setSourceId(s.stop_id);
    setShowSourceSuggestions(false);
    fetchPossibleStops(s.stop_id);
  };

  const handleDestSuggestionClick = (s) => {
    setDestination(s.stop_name);
    setDestinationId(s.stop_id);
    setShowDestSuggestions(false);

    navigate(`/fareCharges?from=${sourceId}&to=${s.stop_id}`, {
      state: {
        sourceName: source,
        destinationName: s.stop_name,
      },
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid justify-content-center">
          <span className="navbar-brand fw-bold">Price Enquiry</span>
        </div>
      </nav>

      <div className="d-flex justify-content-center align-items-center flex-grow-1 py-5">
        <div
          className="card border-0 shadow-lg p-4 w-100"
          style={{ maxWidth: "500px", borderRadius: "16px" }}
        >
          <div className="card-body">
            <h2 className="fw-bold text-center mb-3">Check Fare</h2>
            <form onSubmit={handleSubmit}>
              {/* Source */}
              <div className="mb-3 position-relative">
                <label htmlFor="source" className="form-label fw-semibold">
                  Source Stop
                </label>
                <input
                  type="text"
                  id="source"
                  className="form-control form-control-lg"
                  placeholder="Enter Source Stop"
                  value={source}
                  onChange={handleSourceChange}
                  autoComplete="off"
                />

                {showSourceSuggestions && sourceSuggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 z-3 shadow-sm"
                    style={{
                      top: "100%",
                      left: 0,
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    {sourceSuggestions.slice(0, 5).map((s, i) => (
                      <li
                        key={i}
                        className="list-group-item list-group-item-action p-3"
                        tabIndex={0}
                        style={{ cursor: "pointer", backgroundColor: "#fff" }}
                        onClick={() => handleSourceSuggestionClick(s)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSourceSuggestionClick(s);
                        }}
                      >
                        <strong>{s.stop_name}</strong>
                        <small className="text-muted"> ({s.stop_id})</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Destination */}
              <div className="mb-3 position-relative">
                <label htmlFor="destination" className="form-label fw-semibold">
                  Destination Stop
                </label>
                <input
                  type="text"
                  id="destination"
                  className="form-control form-control-lg"
                  placeholder="Enter Destination Stop"
                  value={destination}
                  onChange={handleDestinationChange}
                  autoComplete="off"
                  disabled={!sourceId}
                />

                {showDestSuggestions && destSuggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 z-3 shadow-sm"
                    style={{
                      top: "100%",
                      left: 0,
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    {destSuggestions.slice(0, 5).map((s, i) => (
                      <li
                        key={i}
                        className="list-group-item list-group-item-action p-3"
                        tabIndex={0}
                        style={{ cursor: "pointer", backgroundColor: "#fff" }}
                        onClick={() => handleDestSuggestionClick(s)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleDestSuggestionClick(s);
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
                Get Fare Details
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Price;