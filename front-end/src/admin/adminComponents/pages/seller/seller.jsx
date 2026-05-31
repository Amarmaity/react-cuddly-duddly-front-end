import React, { useState } from "react";
import SellerSvg from "../../../../assets/seller.webp";
import {useNavigate} from "react-router-dom";
import "./seller.css";

const Seller = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("sellers");
  return (
    <div>
      <div className="seller-heading">
        <img className="seller-svg" src={SellerSvg} alt="svg" />
        <h1>Sellers</h1>

        <button className="seller-create"
        onClick={() => navigate("/admin-dashboard/seller/create") }
        >Create Seller</button>
      </div>

      <div className="seller-body">
        <div className="seller-tab-area">
          <label
            className={`seller-tab ${activeTab === "sellers" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("sellers")}
          >
            All Sellers
          </label>
          <label
            className={`payout-tab ${
              activeTab === "payouts" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("payouts")}
          >
            Payouts
          </label>
        </div>

        {activeTab === "sellers" && (
          <div className="seller-content">
            <div className="seller-search-area">
              <input
                type="text"
                placeholder="Search seller"
                className="seller-search"
              />

              <table className="seller-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>

              {activeTab === "payouts" && (
                <div className="seller-content">
                  <h3>Payout Information</h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Seller;
