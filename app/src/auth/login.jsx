import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

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
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex justify-content-center">
          <span className="navbar-brand mb-0 h1 fw-bold text-center">
            DTC Tracker
          </span>
        </div>
      </nav>

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

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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