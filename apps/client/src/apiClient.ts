import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
