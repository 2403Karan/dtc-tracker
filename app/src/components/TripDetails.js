import React, { useEffect, useState } from 'react';
import { useParams,NavLink,useLocation } from 'react-router-dom';
import axios from "axios";


function TripDetails() {
  const { tripId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originStop, setOriginStop] = useState("");
  const [destinationStop, setDestinationStop] = useState("");
  const location=useLocation()
  const {routeName} = location.state || {};

  useEffect(() => {
    if (!tripId) return;

    const apiUrl = `http://127.0.0.1:8000/dtc_tracker/trip/${tripId}/schedule`;

    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        if (response.data.length > 0) {
          setOriginStop(response.data[0].stop_name);
          setDestinationStop(response.data[response.data.length - 1].stop_name);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data, please try again.");
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [tripId]); 

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
      
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl mb-2 text-center">Trip Details</h1>
        <p className="text-xl text-center font-normal "><b>Trip Number :</b>{tripId}({routeName})</p>
        <div className="text-center mb-3">
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <div className="border rounded p-2"><b>Originate: </b>{originStop}</div>
              <div className="border rounded p-2"><b>Terminate: </b>{destinationStop}</div>
            </div>
          </div>
        {loading && <p className="text-blue-500">Loading bus schedule...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {data.length > 0 && !loading && !error ? (
          <div
            className="overflow-x-auto bg-white border rounded-lg shadow-sm center"
            style={{ maxHeight: "280px", overflowY: "auto" ,width:"500px" ,margin: "0 auto"}}
          >
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
          !loading &&
          !error && (
            <p className="text-gray-500">No schedule available for this trip.</p>
          )
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
