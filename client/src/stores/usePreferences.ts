import { LEDGER_ID_STORAGE_KEY } from '@/constants/prefrences.constants.ts';
import { create } from 'zustand';

type PreferencesState = {
	ledgerId: string | null;
	setLedgerId: (ledgerId: string | null) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => {
	return {
		ledgerId: localStorage.getItem(LEDGER_ID_STORAGE_KEY) || null,
		setLedgerId: (ledgerId: string | null) => {
			localStorage.setItem(LEDGER_ID_STORAGE_KEY, ledgerId || '');
			set({ ledgerId });
		},
	};
});
