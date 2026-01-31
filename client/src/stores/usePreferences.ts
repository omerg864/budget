import { create } from 'zustand';

type PreferencesState = {
	ledgerId: string | null;
	setLedgerId: (ledgerId: string | null) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => {
	return {
		ledgerId: null,
		setLedgerId: (ledgerId: string | null) => {
			set({ ledgerId });
		},
	};
});
