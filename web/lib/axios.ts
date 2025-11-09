import { default as axiosClient } from "axios";

export const axios = axiosClient.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});
