import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../components/sidebar/sidebar";

const AdminLayout = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          backgroundColor: "#f1f5f9",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
