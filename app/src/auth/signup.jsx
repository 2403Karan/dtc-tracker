import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const navigate = useNavigate();

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });

    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 2000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("http://127.0.0.1:8000/dtc_tracker/register", {
        username,
        password,
      });

      const loginResponse = await axios.post(
        "http://127.0.0.1:8000/dtc_tracker/login",
        {
          username,
          password,
        }
      );

      if (loginResponse.status === 200) {
        localStorage.setItem("token", loginResponse.data.access_token);

        navigate("/dashboard", {
          state: { message: "Account created successfully" },
        });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Error creating account";

      setUsername("");
      setPassword("");

      if (
        typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("already exists")
      ) {
        showNotification("error", "User already registered, please login");
      } else {
        showNotification("error", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex justify-content-center">
          <span className="navbar-brand fw-bold">DTC Tracker</span>
        </div>
      </nav>

      {notification.show && (
        <div
          className={`position-fixed top-0 end-0 m-3 alert ${
            notification.type === "success"
              ? "alert-success"
              : "alert-danger"
          }`}
          style={{ zIndex: 9999, minWidth: "280px" }}
        >
          {notification.message}
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center flex-grow-1 bg-light px-3">
        <form
          onSubmit={handleSignup}
          className="p-4 bg-white shadow rounded w-100"
          style={{ maxWidth: "360px" }}
        >
          <h3 className="mb-3 text-center">Sign Up</h3>

          <input
            type="text"
            placeholder="Username"
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <button
            type="button"
            className="btn btn-outline-dark w-100 mt-2"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </form>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Signup;