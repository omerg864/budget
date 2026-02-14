import { API_ROUTES } from '@shared/constants/routes.constants';
import axios from 'axios';
import { authClient } from './auth.client';

const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : ''}/${API_ROUTES.BASE}`,
	withCredentials: true, // Crucial for cookie-based auth
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const { data, error: refreshError } =
					await authClient.getSession();

				if (refreshError || !data) {
					return Promise.reject(error);
				}

				return api(originalRequest);
			} catch (refreshErr) {
				return Promise.reject(refreshErr);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
