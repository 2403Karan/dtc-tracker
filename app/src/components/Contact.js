import React from 'react';
import { NavLink } from 'react-router-dom';

function Contact() {
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

      {/* Contact Content */}
      <main className="container my-5 flex-grow-1 text-center" style={{ fontSize: '24px' }}>
      <h1 className="mb-4">Contact Us</h1>
      <p>Have questions, feedback, or suggestions? We'd love to hear from you!</p>
      <p><strong>Email:</strong> <a href="mailto:sharmakarandutt2004@gmail.com" style={{ color: 'blue' }}>sharmakarandutt2004@gmail.com</a></p>
      <p><strong>Phone:</strong> +91-9992574401</p>
      <p><strong>Address:</strong> DTC System HQ, Connaught Place, New Delhi, India</p>
      </main>


      <footer className="bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
    </div>
  )
}

export default Contact