import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 60 * 10, // 24 hours
			retry: (failureCount, error) => {
				// Cast error to AxiosError to access status codes
				const axiosError = error as AxiosError;

				// 1. Don't retry if the error is 401 Unauthorized
				// (This means your auto-refresh logic in Axios already failed)
				if (axiosError.response?.status === 401) {
					return false;
				}

				// 2. Don't retry on 404s (The resource really isn't there)
				if (axiosError.response?.status === 404) {
					return false;
				}

				// 3. Otherwise, retry up to 2 times (total 3 attempts)
				return failureCount < 2;
			},
		},
	},
});

export default queryClient;
