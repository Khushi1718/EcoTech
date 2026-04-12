import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:5001","https://ecotech-nyvt.onrender.com"
// });
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "https://ecotech-nyvt.onrender.com";

const instance = axios.create({ baseURL });

// Add auth token to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;