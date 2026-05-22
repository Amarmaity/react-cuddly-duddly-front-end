import React, { useState } from "react";
import logo from "../../../assets/companylogoContact.webp";
import babyHug from "../../../assets/motherandchildContact.webp";
import "./regstration.css";
import { useNavigate } from "react-router-dom";
import axois from "axios";


const Registration=()=> {
  const [btnactive, setbtnactive] = useState(false);
  const [phoneEmail, setPhoneEmail] = useState("");

  const navigate = useNavigate();

  const sendOTP = async() => {
    try {

      const response = await axois.post(

      )
    } catch (error) {      console.error("Error sending OTP:", error);
    };
  }

  const activebtn = () => {
    setbtnactive(!btnactive);
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
            <input type="checkbox" 
            onChange={(e) => setbtnactive(e.target.checked)}
            />
            <p className="check-box-gape">
              I agree to the Terms & Conditions and Privacy Policy
            </p>
          </div>
          <button
            disabled={btnactive === true ? true : false}
            className={btnactive ? "continue-btn active-btn" : "continue-btn2"}
          >
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registration;
