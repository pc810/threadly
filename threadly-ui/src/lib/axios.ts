import axiosClient from "axios";
import { tokenAtom } from "@/atoms/auth";
import { store } from "@/atoms/store";
import { tokenDTO } from "@/types/auth";

export const axios = axiosClient.create({
	baseURL: import.meta.env.VITE_API_URL ?? process.env.VITE_API_URL,
	withCredentials: true,
});

axios.interceptors.request.use((config) => {
	const tokenData = store.get(tokenAtom);

	if (tokenData?.accessToken && config.headers) {
		config.headers.Authorization = `Bearer ${tokenData.accessToken}`;
	}

	return config;
});

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Prevent infinite loop
		if (originalRequest._retry) {
			return Promise.reject(error);
		}

		if (originalRequest.url?.includes("/auth/refresh")) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401) {
			originalRequest._retry = true;

			try {
				const res = await axios.post<tokenDTO>("/auth/refresh");
				store.set(tokenAtom, res.data ?? null);

				return axios(originalRequest);
			} catch (err) {
				store.set(tokenAtom, null);
				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	},
);
