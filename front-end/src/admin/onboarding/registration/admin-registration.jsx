import React, { useState, useEffect } from "react";
import "./admin-registration.css";

const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    user_type: "",
    password: "",
    confirm_password: "",
  });

  // ================= VALIDATION =================

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phoneRegex = /^[6-9]\d{9}$/;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const formIsValid =
    formData.full_name.trim().length >= 3 &&
    emailRegex.test(formData.email) &&
    phoneRegex.test(formData.mobile) &&
    formData.user_type.trim() !== "" &&
    passwordRegex.test(formData.password) &&
    formData.password === formData.confirm_password;

  // ================= SUBMIT =================

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <div className="row">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
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
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Phone</label>
                <input
                  type="text"
                  placeholder="Enter phone"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
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
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="tester">Tester</option>
                  <option value="operations">Operations</option>
                  <option value="super-user">Super User</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
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

            <button type="submit" disabled={!formIsValid}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;
