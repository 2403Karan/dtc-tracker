import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
// import "./home.css";

const Home = () => {
  const navLinks = [
        { to: "/", label: "Home" },
        { to: "/stop", label: "Stop" },
        { to: "/fare", label: "Price" },
        { to: "/contact", label: "Contact" },
        { to: "/about", label: "About us" }
      ];

  return (
    <div className="d-flex flex-column min-vh-100" >
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <NavLink className="navbar-brand fw-bold" to="/">DTC Tracker</NavLink>
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

      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 bg-light text-center py-5">
        <h1 className="display-4 fw-bold text-dark mb-3">Welcome to DTC System</h1>
      </div>

    <footer className="bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
    </div>
  );
};

export default Home;
