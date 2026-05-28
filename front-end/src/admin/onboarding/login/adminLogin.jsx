import React from "react";
import "./adminLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Message from "../../../components/messages";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email_or_phone: "",
    password: "",
    user_type: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailOrPhoneRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+|[6-9]\d{9})$/;

  const checkUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/check-admin-user/`,
        {
          email_or_mobile: formData.email_or_phone.trim(),
          password: formData.password.trim(),
          user_type: formData.user_type.trim(),
        },
      );
      if (response.data.exists) {
        setSuccess("Login Succcessful!");
        setError("");

        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1500);
      } else {
        navigate("/admin-register");
        setError("Invalid credentials. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error checking user existence:", error);

      if (error.response && error.response.data) {
        const backendMessage = error.response.data.message;

        if (typeof backendMessage === "object") {
          const firstError = Object.values(backendMessage)[0];
          const errorMessage = Array.isArray(firstError)
            ? firstError[0]
            : firstError;

          if (errorMessage === "User not found") {
            setError("User not found. Please register first.");
            setTimeout(() => {
              navigate("/admin-register");
            }, 1500);
          } else {
            setError(errorMessage);
          }
        } else {
          if (backendMessage === "User not found") {
            setError("User not found. Please register first.");
            setTimeout(() => {
              navigate("/admin-register");
            }, 1000);
          } else {
            setError(backendMessage);
          }
        }
      } else {
        setError("Unable to login. Please try again.");
      }

      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.email_or_phone.trim() === "") {
      setError("Please enter email or phone");
      return;
    }

    if (!emailOrPhoneRegex.test(formData.email_or_phone.trim())) {
      setError("Please enter a valid email address or 10 digit mobile number");
      return;
    }

    if (formData.password.trim() === "") {
      setError("Please enter password");
      return;
    }

    if (formData.user_type.trim() === "") {
      setError("Please select user type");
      return;
    }

    await checkUser();
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1 style={{ color: "#e96969", textAlign: "center" }}>Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email or Phone</label>

            <input
              type="text"
              placeholder="Enter email or phone"
              autoComplete="username"
              value={formData.email_or_phone}
              onChange={(e) =>
                setFormData({ ...formData, email_or_phone: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>User Type</label>

            <select
              value={formData.user_type}
              onChange={(e) =>
                setFormData({ ...formData, user_type: e.target.value })
              }
            >
              <option value="">Select user type</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="tester">Tester</option>
              <option value="operations">Operations</option>
            </select>
          </div>

          <div className="input-button">
            <button className="admin-login-button" type="submit">
              Login
            </button>
          </div>
        </form>
        <Message type="error" message={error} clearMessage={setError} />

        <Message type="success" message={success} clearMessage={setSuccess} />
      </div>
    </div>
  );
};

export default AdminLogin;
