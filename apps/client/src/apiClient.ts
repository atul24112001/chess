import axios from "axios";

const baseURL = "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
