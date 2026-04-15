import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// apni image ka path yaha do
import delhiImage from "../assets/delhi-map.jpg";

const Dashboard = () => {
  const stats = [
    { title: "Total Stops", value: "10000+", subtitle: "Across Delhi" },
    { title: "Total Routes", value: "2400+", subtitle: "Operational routes" },
    { title: "Active Trips", value: "80000+", subtitle: "Running now" },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
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
            <div
              className="card border-0 shadow-sm"
              style={{ height: "350px" }}
            >
              <div className="card-body d-flex flex-column justify-content-between">
                {/* Stats in small boxes */}
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

          {/* Right Section - Image */}
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