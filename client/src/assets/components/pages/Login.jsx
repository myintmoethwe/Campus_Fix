import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../pages/AuthLayout";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token || !data.user) {
        throw new Error("Token or user information missing");
      }

      const role = String(data.user.role || "")
        .trim()
        .toUpperCase();

      if (!["STUDENT", "TEACHER", "ADMIN"].includes(role)) {
        throw new Error(`Unknown user role: ${role}`);
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          role,
        }),
      );

      if (role === "STUDENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (role === "TEACHER") {
        navigate("/teacher/dashboard", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-form">
        <h2 className="auth-heading">Login your Account</h2>

        <p className="auth-description">Please enter your details</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Link to="/forgot-password" className="auth-forgot">
            Forgot password?
          </Link>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-bottom">
          <span>Don't have an account?</span>
          <Link to="/register">Sign up</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
