import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import delhiImage from "../assets/delhi-map.jpg";

const Dashboard = () => {
  const location = useLocation();

  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const stats = [
    { title: "Total Stops", value: "10000+", subtitle: "Across Delhi" },
    { title: "Total Routes", value: "2400+", subtitle: "Operational routes" },
    { title: "Active Trips", value: "80000+", subtitle: "Running now" },
  ];

  // ✅ Show notification after navigation
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        show: true,
        message: location.state.message,
      });

      setTimeout(() => {
        setNotification({
          show: false,
          message: "",
        });
      }, 2000);
    }
  }, [location.state]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      {/* ✅ Notification */}
      {notification.show && (
        <div
          className="position-fixed top-0 end-0 m-3 alert alert-success shadow"
          style={{ zIndex: 9999, minWidth: "280px" }}
        >
          {notification.message}
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid justify-content-center">
          <span className="navbar-brand fw-bold">DTC Dashboard</span>
        </div>
      </nav>

      <div className="container py-4 flex-grow-1">
        {/* Welcome */}
        <div className="bg-white rounded shadow-sm p-3 mb-4 text-center">
          <h1 className="fw-bold mb-2">Welcome to DTC System</h1>
          <p className="text-muted mb-0">
            Manage stops, routes, fares and track trips in real-time.
          </p>
        </div>

        <div className="row g-4">
          {/* Left Section */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm" style={{ height: "350px" }}>
              <div className="card-body d-flex flex-column justify-content-between">

                {/* Stats */}
                <div className="row g-3">
                  {stats.map((item, index) => (
                    <div className="col-md-4 col-12" key={index}>
                      <div
                        className="border rounded p-3 h-100 text-center bg-light"
                        style={{ minHeight: "120px" }}
                      >
                        <h6 className="text-muted mb-2">{item.title}</h6>
                        <h4 className="fw-bold mb-1">{item.value}</h4>
                        <small className="text-secondary">{item.subtitle}</small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nav Links */}
                <div className="d-grid gap-2 mt-4">
                  <NavLink to="/stop" className="btn btn-primary">
                    Stop Enquiry
                  </NavLink>

                  <NavLink to="/fare" className="btn btn-success">
                    Check Fare
                  </NavLink>

                  <NavLink to="/contact" className="btn btn-dark">
                    Contact Us
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-7">
            <div
              className="card border-0 shadow-sm overflow-hidden"
              style={{ height: "350px" }}
            >
              <img
                src={delhiImage}
                alt="Delhi"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;