import axios from "axios";

const instance = axios.create({
  baseURL: "https://ecotech-nyvt.onrender.com",
});

// Add auth token to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;