import { create } from 'zustand';
import { IS_AUTHENTICATED_STORAGE_KEY } from '../constants/auth.constants.ts';

type AuthState = {
	isAuthenticated: boolean;
	setAuthenticated: () => void;
	removeAuthenticated: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated:
		localStorage.getItem(IS_AUTHENTICATED_STORAGE_KEY) === 'true',
	setAuthenticated: () => {
		localStorage.setItem(IS_AUTHENTICATED_STORAGE_KEY, 'true');
		set({ isAuthenticated: true });
	},
	removeAuthenticated: () => {
		localStorage.setItem(IS_AUTHENTICATED_STORAGE_KEY, 'false');
		set({ isAuthenticated: false });
	},
}));
