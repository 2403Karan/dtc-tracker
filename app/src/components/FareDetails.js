import { useState, useEffect } from "react";
import { useSearchParams, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
    navigate(`/routeDetails?fromStopId=${source}&toStopId=${destination}&routeId=${routeId}`, {
      state: {
        sourceName,
        destinationName,
        routeId,
        routeName
      },
    });
  } else {
    alert("Please enter both source and destination!");
  }};

  useEffect(() => {
    if (!source || !destination) return;

    const apiUrl = `http://127.0.0.1:5000/dtc_tracker/fare?from=${source}&to=${destination}`;

    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        setData(response.data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching fare details. Please try again.");
        setLoading(false);
        console.error("API Error:", error);
      });
  }, [source, destination]);

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

      <div className="max-w-4xl mx-auto p-4 home">
        <h1 className="text-xl mb-4">Fare Details</h1>
        <p>
          From: <strong>{sourceName}</strong>
          <br />
          To: <strong>{destinationName}</strong>
        </p>
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && data.length === 0 && (
          <p className="text-gray-500">No fare details found for this route.</p>
        )}
        {!loading && data.length > 0 && (
          <div
            className="overflow-x-auto shadow-sm rounded-lg"
            style={{ maxHeight: "280px", overflowY: "auto" }}
          >
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">Route Name</th>
                  <th className="px-4 py-2 border-b">Price(₹)</th>
                </tr>
              </thead>
              <tbody>
            {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border-b">
                      <button
                        className="text-blue-600 cursor-pointer hover:underline bg-transparent border-0 p-0"
                        title="Click to view route details"
                        onClick={() => handleSubmit(item.route_id, item.route_name)}
                      >
                        {item.route_name}
                      </button>
                    </td>
                    <td className="px-4 py-2 border-b font-semibold text-gray-700">
                      ₹{item.price}
                    </td>
                  </tr>
             ))}
            </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default FareDetails;
