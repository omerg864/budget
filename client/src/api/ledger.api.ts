import { API_ROUTES } from '@shared/constants/routes.constants';
import type {
	CreateCategoryDto,
	CreateLedgerDto,
	UpdateCategoryDto,
	UpdateLedgerDto,
} from '@shared/schemas/ledger.schemas'; // Assuming schemas export DTO types or can be inferred
import type { LedgerEntity } from '@shared/types/ledger.type';
import { generateLink } from '@shared/utils/route.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';

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
