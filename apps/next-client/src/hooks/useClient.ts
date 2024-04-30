"use client";

import { BACKEND_URL } from "@/store/atoms/user";
import axios from "axios";
import Cookie from "js-cookie";

let apiClient = axios.create();
let first = true;

export const useClient = () => {
  if (first) {
    apiClient = axios.create({
      baseURL: `/api`,
      headers: {
        Authorization: `Bearer ${Cookie.get("accessToken") || ""}`,
      },
    });
    first = false;
  }

  return apiClient;
};
