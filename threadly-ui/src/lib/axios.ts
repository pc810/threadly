import { default as axiosClient } from "axios";

export const axios = axiosClient.create({
	baseURL: import.meta.env.VITE_API_URL ?? process.env.VITE_API_URL,
	withCredentials: true,
});
