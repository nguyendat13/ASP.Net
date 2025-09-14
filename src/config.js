const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:7177"
    : "https://fruit-store-pb5n.onrender.com";

export default API_BASE_URL;
