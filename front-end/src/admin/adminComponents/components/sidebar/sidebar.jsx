import React from "react";
import "./sidebar.css";
// import { NavLink } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/logout/`,
        {
          refresh: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("admin_user");

      navigate("/admin-login", { replace: true });
    }
  };

  return (
    <div className="sidebar-main">
      <div>
        <div className="sidebar-heading">
          <h1>Admin Panel</h1>
        </div>

        <div className="sidebar-menu">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            end
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin-dashboard/seller"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Seller Management
          </NavLink>

          <NavLink
            to="/admin-dashboard/product"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Product Management
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Settings
          </NavLink>

          <div className="sidebar-link logout-link" onClick={handleLogout}>
            <CiLogout style={{ marginRight: "8px" }} />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
