import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "https://agridrone.onrender.com/api", // Direct connection to backend server with /api prefix
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page if needed
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
