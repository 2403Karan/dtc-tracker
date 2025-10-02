import React, { useState, useEffect } from "react";
import { useParams,NavLink,useLocation } from "react-router-dom";
import axios from "axios";

function StopTimings() {
  const { stopNo } = useParams(); // Get values from URL
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location=useLocation()
  const {stop,scode} = location.state || {};

  useEffect(() => {
    if (!stopNo) return; // Prevent errors if params are missing

    const apiUrl = `http://127.0.0.1:5000/dtc_tracker/stop/${stopNo}/timing?page=1&pageSize=20`;
    
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data, please try again later.");
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [stopNo]); // Runs when URL parameters change\

   const navLinks = [
        { to: "/", label: "Home" },
        { to: "/stop", label: "Stop" },
        { to: "/fare", label: "Price" },
        { to: "/contact", label: "Contact" },
        { to: "/about", label: "About us" }
      ];

  return (
    <div className="d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <NavLink className="navbar-brand fw-bold" to="/">
                DTC Tracker
              </NavLink>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
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


     <div className="max-w-4xl mx-auto p-4 ">
    <h1 className="text-xl mb-4">Bus Timings</h1>
    <p> 
    Stop Name: <strong>{stop+"("+scode+")"}</strong>
    </p>
      {loading && <p className="text-blue-500">Loading bus timings...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data.length > 0 && !loading && !error ? (
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm" 
             style={{ maxHeight: '300px' ,overflowY: "auto" }}>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Route</th>
                <th className="px-4 py-2 text-left">Trip ID</th>
                <th className="px-4 py-2 text-left">Arrival Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.route_name}</td>
                  <td className="px-4 py-2">{item.trip_id}</td>
                  <td className="px-4 py-2">{item.arrival_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && !error && <p className="text-gray-500">No bus timings available for this stop.</p>
      )}
    </div>
     <footer className="bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default StopTimings;
