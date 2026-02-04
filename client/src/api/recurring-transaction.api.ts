import { API_ROUTES } from '@shared/constants/routes.constants';

import {
	CreateRecurringTransactionSchema,
	UpdateRecurringTransactionSchema,
} from '@shared/schemas/recurringTransaction.schemas';
import type { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type';
import { generateLink } from '@shared/utils/route.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import axios from '../lib/clients/axios.client';

export type CreateRecurringTransactionDto = z.infer<
	typeof CreateRecurringTransactionSchema
>;
export type UpdateRecurringTransactionDto = z.infer<
	typeof UpdateRecurringTransactionSchema
>;

export const useRecurringTransactionsQuery = (ledgerId: string) => {
	return useQuery({
		queryKey: [
			API_ROUTES.RECURRING_TRANSACTION.BASE,
			API_ROUTES.RECURRING_TRANSACTION.FIND_ALL,
			ledgerId,
		],
		queryFn: async () => {
			if (!ledgerId) return [];
			const url = generateLink({
				route: [
					API_ROUTES.RECURRING_TRANSACTION.BASE,
					API_ROUTES.RECURRING_TRANSACTION.FIND_ALL,
				],
				params: { ledgerId },
			});
			const { data } = await axios.get<RecurringTransactionEntity[]>(url);
			return data;
		},
		enabled: !!ledgerId,
	});
};

export const useCreateRecurringTransactionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateRecurringTransactionDto) => {
			const url = generateLink({
				route: [
					API_ROUTES.RECURRING_TRANSACTION.BASE,
					API_ROUTES.RECURRING_TRANSACTION.CREATE,
				],
			});
			const { data: response } =
				await axios.post<RecurringTransactionEntity>(url, data);
			return response;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [
					API_ROUTES.RECURRING_TRANSACTION.BASE,
					API_ROUTES.RECURRING_TRANSACTION.FIND_ALL,
					variables.ledgerId,
				],
			});
		},
	});
};

export const useUpdateRecurringTransactionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateRecurringTransactionDto;
		}) => {
			const url = generateLink({
				route: [
					API_ROUTES.RECURRING_TRANSACTION.BASE,
					API_ROUTES.RECURRING_TRANSACTION.UPDATE,
				],
				params: { id },
			});
			const { data: response } =
				await axios.patch<RecurringTransactionEntity>(url, data);
			return response;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [
					API_ROUTES.RECURRING_TRANSACTION.BASE,
					API_ROUTES.RECURRING_TRANSACTION.FIND_ALL,
					data.ledgerId,
				],
			});
		},
	});
};

export const useDeleteRecurringTransactionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const url = generateLink({
				route: [
					API_ROUTES.RECURRING_TRANSACTION.BASE,
					API_ROUTES.RECURRING_TRANSACTION.DELETE,
				],
				params: { id },
			});
			const { data: response } =
				await axios.delete<RecurringTransactionEntity>(url);
			return response;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [
					API_ROUTES.RECURRING_TRANSACTION.BASE,
					API_ROUTES.RECURRING_TRANSACTION.FIND_ALL,
					data.ledgerId,
				],
			});
		},
	});
};
