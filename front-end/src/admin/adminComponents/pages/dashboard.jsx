import React, { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/admin-dashboard/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
