import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/dtc_tracker/register",
        null,
        {
          params: {
            username,
            password,
          },
        }
      );

      alert("Signup successful!");
      navigate("/login");

    } catch (error) {
      alert("Error creating account");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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

        <button className="btn btn-success w-100">Signup</button>
      </form>

      <p className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;