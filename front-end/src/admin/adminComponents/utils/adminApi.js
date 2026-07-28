import axios from "axios";

const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

export const clearAdminAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("admin_user");
};

const refreshAdminAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    clearAdminAuth();
    throw new Error("Admin session expired. Please login again.");
  }

  const response = await axios.post(`${getApiBaseUrl()}/api/admin/token/refresh/`, {
    refresh: refreshToken,
  });

  localStorage.setItem("access_token", response.data.access);

  if (response.data.refresh) {
    localStorage.setItem("refresh_token", response.data.refresh);
  }

  return response.data.access;
};

export const adminApiRequest = async (config) => {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    clearAdminAuth();
    throw new Error("Admin session expired. Please login again.");
  }

  const requestConfig = {
    ...config,
    url: `${getApiBaseUrl()}${config.url}`,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: config.timeout || 10000,
  };

  try {
    return await axios.request(requestConfig);
  } catch (error) {
    if (error.response?.status !== 401) {
      throw error;
    }

    try {
      const nextAccessToken = await refreshAdminAccessToken();

      return await axios.request({
        ...requestConfig,
        headers: {
          ...requestConfig.headers,
          Authorization: `Bearer ${nextAccessToken}`,
        },
      });
    } catch (refreshError) {
      clearAdminAuth();
      throw refreshError;
    }
  }
};
