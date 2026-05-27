import React, { useState } from "react";
import logo from "../../../assets/companylogoContact.webp";
import babyHug from "../../../assets/motherandchildContact.webp";
import "./regstration.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

const Registration = () => {
  const [btnactive, setbtnactive] = useState(false);
  const [phoneEmail, setPhoneEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // const navigate = useNavigate();

  const handleValidation = (value) => {
    setError("");

    const phoneRegex = /^\d{10}$/;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // PHONE CHECK

    if (/^\d+$/.test(value)) {
      if (phoneRegex.test(value)) {
        setPhoneEmail(value);

        sendOTP(value);
      } else {
        setError("Please enter a valid 10-digit phone number.");
      }
    }

    // EMAIL CHECK
    else {
      if (emailRegex.test(value)) {
        setPhoneEmail(value);

        sendOTP(value);
      } else {
        setError("Please enter a valid email address.");
      }
    }
  };

  const sendOTP = async (value) => {
    try {
      const response = await axios.post("#", {
        phoneEmail: value,
      });
      setSuccess("OTP sent successfully!");
      setError("");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP");
      setSuccess("");
    }
  };
  
  return (
    <div className="registration-main-div">
      <div className="logo-image-div">
        <img className="logo-image" src={logo} alt="logo-png" />
      </div>

      <div className="baby-hug-border">
        <div className="image-div">
          <img className="baby-hug" src={babyHug} alt="baby-hug" />
        </div>

        <div className="image-div">
          <h1>Start Selling Online</h1>
          <p>Let's get you started.</p>
          <p>Enter mobile number or email address</p>
          <input
            className="input-phone-email"
            type="text"
            placeholder="Enter mobile number or email address"
            value={phoneEmail}
            onChange={(e) => setPhoneEmail(e.target.value)}
          />

          <div className="registration-check-box">
            <input
              type="checkbox"
              onChange={(e) => setbtnactive(e.target.checked)}
            />
            <p className="check-box-gape">
              I agree to the Terms & Conditions and Privacy Policy
            </p>
          </div>
          <button
            disabled={!btnactive}
            className={btnactive ? "continue-btn active-btn" : "continue-btn2"}
            onClick={() => handleValidation(phoneEmail)}
          >
            Send OTP
          </button>
          <p className="error-message" style={{ color: "red" }}>
            {error}
          </p>
          <p className="success-message" style={{ color: "green" }}>
            {success}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
