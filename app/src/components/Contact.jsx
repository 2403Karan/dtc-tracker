import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Contact() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container-fluid justify-content-center">
          <span className="navbar-brand fw-bold">Contact Us</span>
        </div>
      </nav>

      {/* Contact Content */}
      <main className="container flex-grow-1 d-flex justify-content-center align-items-center">
        <div
          className="card shadow-lg border-0 text-center p-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <h2 className="fw-bold mb-3">Get in Touch 📞</h2>
          <p className="text-muted mb-4">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>

          <div className="mb-3">
            <h6 className="text-muted">Email</h6>
            <a
              href="mailto:sharmakarandutt2004@gmail.com"
              className="fw-bold text-decoration-none"
            >
              sharmakarandutt2004@gmail.com <br />
              kseth948@gmail.com
            </a>
          </div>

          <div className="mb-4">
            <h6 className="text-muted">Address</h6>
            <p className="fw-bold mb-0">
              DTC System HQ, Connaught Place, New Delhi, India
            </p>
          </div>

          {/* Back Button */}
          <NavLink to="/" className="btn btn-dark w-100">
            Back to Dashboard
          </NavLink>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Contact;