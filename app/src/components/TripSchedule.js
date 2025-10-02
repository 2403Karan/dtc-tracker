import React, { useEffect, useState } from 'react';
import { useParams,NavLink } from 'react-router-dom';
import axios from "axios";


function TripSchedule() {
  const { tripId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) return; // Prevent errors if params are missing

    const apiUrl = `http://127.0.0.1:5000/dtc_tracker/trip/${tripId}/schedule`;

    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data, please try again.");
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [tripId]); // Runs when URL parameters change
  
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md home">
      <h2 className="text-2xl font-semibold mb-6 text-center">Bus Schedule for Trip: {tripId}</h2>

      {loading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-500">Loading bus schedule...</p>
        </div>
      )}

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {data.length > 0 && !loading && !error ? (
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm" style={{ maxHeight: "350px", overflowY: "auto" }}>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Stop Name</th>
                <th className="px-4 py-2 text-left">Arrival Time</th>
                <th className="px-4 py-2 text-left">Departure Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.stop_name}</td>
                  <td className="px-4 py-2">{item.arrival_time}</td>
                  <td className="px-4 py-2">{item.departure_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && !error && <p className="text-gray-500">No schedule available for this trip.</p>
      )}
    </div>
    <footer className="bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default TripSchedule;
