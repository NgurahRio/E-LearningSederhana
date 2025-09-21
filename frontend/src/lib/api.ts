import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // ganti kalau beda port
});

export default API;
