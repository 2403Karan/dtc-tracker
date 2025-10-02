import React from 'react';
import { NavLink } from 'react-router-dom';

function About() {
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

   
    {/* About Content */}
    <main className="container my-5 flex-grow-1 text-center" style={{ fontSize: '18px' }}>
    <h1 className="mb-4">About Us</h1>
    <p>
    The DTC System is a next-generation platform built to transform urban transport management. Our goal is to automate 
    and streamline bus scheduling, route optimization, and real-time tracking—beginning with Delhi Transport Corporation
    (DTC) and expanding further.
    </p>
    <p>
    Powered by cutting-edge technologies like Flask APIs, MySQL, and React, the DTC System enhances operational 
    efficiency and commuter experience. It intelligently reduces delays, optimizes routes, and delivers reliable 
    analytics for day-to-day and strategic decisions.
    </p>
    <p>
    Our platform not only assists DTC in real-time decision-making but also lays the foundation for smart city 
    integration and data-driven governance.Through automation and data centralization, we reduce manual overhead, 
    increase fleet reliability, and support greener, more sustainable transit operations.
    </p>
    </main>
    
    <footer className="bg-dark text-white text-center py-3 mt-auto">
    <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
    </footer>
    </div>
  )
}

export default About