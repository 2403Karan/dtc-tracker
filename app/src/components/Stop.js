import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

function Stop() {
  const [stopName, setStopName] = useState("");
  const [stopId, setStopId] = useState("");
  const [stopCode,setStopCode]=useState("")
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    proceedButton()
  };

  const proceedButton = () =>
  { 
    console.log(stopId)
    if (stopId) {
      navigate(`/stop/${stopId}`,
        {state:{
           stop:stopName,
           scode:stopCode
        }
      });
    } 
  }

  const handleChange = async (e) => {
    const value = e.target.value;
    setStopName(value);
    setStopId(""); 

    if (value.length > 1) {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/dtc_tracker/stop?stopName=${value}`);
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
    console.log(suggestion)
    setStopName(suggestion.stop_name);
    setStopId(suggestion.stop_id);
    setStopCode(suggestion.stop_code)
    setShowSuggestions(false);
    proceedButton();
  };

  const navLinks = [
        { to: "/", label: "Home" },
        { to: "/stop", label: "Stop" },
        { to: "/fare", label: "Price" },
        { to: "/contact", label: "Contact" },
        { to: "/about", label: "About us" }
      ];

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink className="navbar-brand fw-bold" to="/">
          DTC Tracker
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 bg-light text-center py-5">
        <h1 className="display-4 fw-bold text-dark mb-3">Stop Details</h1>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
          <div className="mb-3 position-relative">
            <label className="form-label" htmlFor="stopNo">Enter Stop Name:</label>
            <input
              type="text"
              id="stopNo"
              placeholder="Enter Stop Name"
              value={stopName}
              onChange={handleChange}
              className="form-control"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100 z-3" style={{ top: "100%", left: 0 }}>
                {suggestions.slice(0, 3).map((s, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action p-3"
                    tabIndex={0}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "5px",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handleSuggestionClick(s)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSuggestionClick(s);
                    }}
                  >
                    <strong>{s.stop_name}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Get Stop Details
          </button>
        </form>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default Stop;
