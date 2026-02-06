import { LedgerAccessRole } from '@shared/constants/ledger.constants';
import { API_ROUTES } from '@shared/constants/routes.constants';
import type {
	CreateCategoryDto,
	CreateLedgerDto,
	UpdateCategoryDto,
	UpdateLedgerDto,
} from '@shared/schemas/ledger.schemas';
import type { LedgerEntity } from '@shared/types/ledger.type';
import { generateLink } from '@shared/utils/route.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';
import { usePreferencesStore } from '../stores/usePreferences';

export const useLedgerQuery = (id?: string) => {
	return useQuery({
		queryKey: [API_ROUTES.LEDGER.BASE, API_ROUTES.LEDGER.FIND_ONE, id],
		queryFn: async () => {
			if (!id) return null;
			const url = generateLink({
				route: [API_ROUTES.LEDGER.BASE, API_ROUTES.LEDGER.FIND_ONE],
				params: { id },
			});
			const { data } = await axios.get<LedgerEntity>(url);
			return data;
		},
		enabled: !!id,
	});
};

export const useLedgersQuery = () => {
	return useQuery({
		queryKey: [API_ROUTES.LEDGER.BASE, API_ROUTES.LEDGER.FIND_ALL],
		queryFn: async () => {
			const url = generateLink({
				route: [API_ROUTES.LEDGER.BASE, API_ROUTES.LEDGER.FIND_ALL],
			});
			const { data } = await axios.get<LedgerEntity[]>(url);
			return data;
		},
	});
};

export const useCreateLedgerMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateLedgerDto) => {
			const url = generateLink({
				route: [API_ROUTES.LEDGER.BASE, API_ROUTES.LEDGER.CREATE],
			});
			const { data: response } = await axios.post<LedgerEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.LEDGER.BASE, API_ROUTES.LEDGER.FIND_ALL],
			});
		},
	});
};

export const useUpdateLedgerMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateLedgerDto;
		}) => {
			const url = generateLink({
				route: [API_ROUTES.LEDGER.BASE, API_ROUTES.LEDGER.UPDATE],
				params: { id },
			});
			const { data: response } = await axios.patch<LedgerEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.LEDGER.BASE],
			});
		},
	});
};

export const useCreateCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			ledgerId,
			data,
		}: {
			ledgerId: string;
			data: CreateCategoryDto;
		}) => {
			const url = generateLink({
				route: [
					API_ROUTES.LEDGER.BASE,
					API_ROUTES.LEDGER.CREATE_CATEGORY,
				],
				params: { id: ledgerId },
			});
			const { data: response } = await axios.post<LedgerEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [
					API_ROUTES.LEDGER.BASE,
					API_ROUTES.LEDGER.FIND_ONE,
					variables.ledgerId,
				],
			});
		},
	});
};

export const useUpdateCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			ledgerId,
			categoryId,
			data,
		}: {
			ledgerId: string;
			categoryId: string;
			data: UpdateCategoryDto;
		}) => {
			const url = generateLink({
				route: [
					API_ROUTES.LEDGER.BASE,
					API_ROUTES.LEDGER.UPDATE_CATEGORY,
				],
				params: { id: ledgerId, categoryId },
			});
			const { data: response } = await axios.patch<LedgerEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [
					API_ROUTES.LEDGER.BASE,
					API_ROUTES.LEDGER.FIND_ONE,
					variables.ledgerId,
				],
			});
		},
	});
};

export const useDeleteLedgerMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const url = generateLink({
				route: [API_ROUTES.LEDGER.BASE, API_ROUTES.LEDGER.DELETE],
				params: { id },
			});
			const { data: response } = await axios.delete<LedgerEntity>(url);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.LEDGER.BASE],
			});
		},
	});
};

export const useDeleteCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			ledgerId,
			categoryId,
		}: {
			ledgerId: string;
			categoryId: string;
		}) => {
			const url = generateLink({
				route: [
					API_ROUTES.LEDGER.BASE,
					API_ROUTES.LEDGER.DELETE_CATEGORY,
				],
				params: { id: ledgerId, categoryId },
			});
			const { data: response } = await axios.delete<LedgerEntity>(url);
			return response;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [
					API_ROUTES.LEDGER.BASE,
					API_ROUTES.LEDGER.FIND_ONE,
					variables.ledgerId,
				],
			});
		},
	});
};

export const useAddUserMutation = () => {
	const { ledgerId } = usePreferencesStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (values: {
			email: string;
			role: LedgerAccessRole;
		}) => {
			if (!ledgerId) throw new Error('No ledger selected');
			await axios.post(
				API_ROUTES.LEDGER.ADD_USER.replace(':id', ledgerId),
				values,
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['ledgerUsers', ledgerId],
			});
		},
	});
};

export const useRemoveUserMutation = () => {
	const { ledgerId } = usePreferencesStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userId: string) => {
			if (!ledgerId) throw new Error('No ledger selected');
			await axios.delete(
				API_ROUTES.LEDGER.REMOVE_USER.replace(':id', ledgerId).replace(
					':userId',
					userId,
				),
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['ledgerUsers', ledgerId],
			});
		},
	});
};
