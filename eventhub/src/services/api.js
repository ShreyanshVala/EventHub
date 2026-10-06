import axios from "axios";

const API = axios.create({
  baseURL: "https://eventhub-34ok.onrender.com/api",
});

export default API;
