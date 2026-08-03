import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin-registration.css";
import Message from "../../../components/messages";
import axios from "axios";

const AdminRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    mobile: "",
    user_type: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const checkUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/check-admin-user/`,
        {
          params: {
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
          },
        },
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      setError("Unable to check user details. Please try again.");
      return null;
    }
  };

  // ================= VALIDATION =================

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phoneRegex = /^[6-9]\d{9}$/;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if(formData.first_name.trim() === "" || formData.last_name.trim() === "") {
      setError("First name and Last name cannot be empty");
      return;
    }

    if (formData.username.trim().length < 3) {
      setError("Username must be at last 3 characters");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valide email");
      return;
    }

    if (!phoneRegex.test(formData.mobile)) {
      setError("Please enter a valide number");
      return;
    }

    if (formData.user_type.trim() === "") {
      setError("please select user type");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain uppercase, lowercase, number & special character",
      );
      return;
    }

    if (formData.password != formData.confirm_password) {
      setError("Password do not match");
      return;
    }

    const userAlreadyExsit = await checkUser();
    if (userAlreadyExsit === null) {
      return;
    }

    if (userAlreadyExsit) {
      setError("User with this email or phone already exists");
      setTimeout(() => {
        navigate("/admin-login");
      }, 3100);
      return;
    }

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        user_type: formData.user_type,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/register/`,
        payload,
      );
      setSuccess(response.data.message || "Registration successful!");
      setError("");
    } catch (error) {
      console.error("Error during registration:", error);
      const message =
        error.response?.data?.email ||
        error.response?.data?.mobile ||
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(message);
      setSuccess("");
    }
  };

  return (
  <div className="admin-registration-main-div">
    <div className="sub-div">
      <div className="heading-div">
        <h1>CuddlyDuddly</h1>
        <p>Admin Registration</p>
      </div>

      <div className="form-div">
        <form onSubmit={handleSubmit}>
          {/* First Name & Last Name */}
          <div className="row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    first_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    last_name: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Username & Email */}
          <div className="row">
            <div className="input-group">
              <label>User Name</label>
              <input
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Phone & User Type */}
          <div className="row">
            <div className="input-group">
              <label>Phone</label>
              <input
                type="text"
                placeholder="Enter phone"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mobile: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>User Type</label>
              <select
                value={formData.user_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user_type: e.target.value,
                  })
                }
              >
                <option value="">Select user type</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="tester">Tester</option>
                <option value="operations">Operations</option>
              </select>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="row">
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirm_password: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button type="submit">Register</button>
        </form>

        <Message
          type="error"
          message={error}
          clearMessage={setError}
        />

        <Message
          type="success"
          message={success}
          clearMessage={setSuccess}
        />
      </div>
    </div>
  </div>
);
};

export default AdminRegistration;
