import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "", // success | error
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        type: "",
        message: "",
      });
    }, 2000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/dtc_tracker/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/dashboard");
        setTimeout(() => {
        showNotification("success", "Login successful!");
        }, 300);
      }
    } catch (error) {
      console.error("Login failed:", error);

      // ✅ CLEAR INPUTS
      setUsername("");
      setPassword("");

      showNotification(
        "error",
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex justify-content-center">
          <span className="navbar-brand mb-0 h1 fw-bold text-center">
            DTC Tracker
          </span>
        </div>
      </nav>

      {notification.show && (
        <div
          className={`position-fixed top-0 end-0 m-3 alert shadow ${
            notification.type === "success" ? "alert-success" : "alert-danger"
          }`}
          style={{
            zIndex: 9999,
            minWidth: "280px",
            borderRadius: "10px",
          }}
        >
          {notification.message}
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center flex-grow-1 bg-light px-3">
        <form
          onSubmit={handleLogin}
          className="p-4 bg-white shadow rounded w-100"
          style={{ maxWidth: "360px" }}
        >
          <h3 className="mb-3 text-center">Login</h3>

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
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="btn btn-outline-dark w-100 mt-2"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </form>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 DTC System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;