import React from "react";
import "./adminLogin.css";

const AdminLogin = () => {

  const handleSubmit = (e) => {
    e.preventDefault();


  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">

        <h1 style={{ color : "#e96969", textAlign : "center"}}>Admin Login</h1>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email or Phone</label>

            <input
              type="text"
              placeholder="Enter email or phone"
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
            />
          </div>

          <div className="input-group">
            <label>User Type</label>

            <select>
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
      </div>
    </div>
  );
};

export default AdminLogin;