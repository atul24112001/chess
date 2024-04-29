import axios from "axios";
import { BACKEND_URL } from "./store/atoms/user";

export const apiClient = axios.create({
  baseURL: `${BACKEND_URL}`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
