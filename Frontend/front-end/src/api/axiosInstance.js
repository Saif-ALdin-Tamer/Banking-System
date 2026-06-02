import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://banking-system-back-end.vercel.app",
});

// Add a request interceptor to include the JWT token in every request
axiosInstance.interceptors.request.use(
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

export default axiosInstance;
