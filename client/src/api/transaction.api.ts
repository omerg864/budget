import { API_ROUTES } from '@shared/constants/routes.constants';
import type {
	CreateTransactionSchemaType,
	UpdateTransactionSchemaType,
} from '@shared/schemas/transaction.schemas';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { generateLink } from '@shared/utils/route.utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';

export const useCreateTransactionMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateTransactionSchemaType) => {
			const url = generateLink({
				route: [
					API_ROUTES.TRANSACTION.BASE,
					API_ROUTES.TRANSACTION.CREATE,
				],
			});
			const { data: response } = await axios.post<TransactionEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.TRANSACTION.BASE],
			});
			// Also invalidate account/credit balances if needed
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.ACCOUNT.BASE],
			});
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.CREDIT.BASE],
			});
		},
	});
};

export const useUpdateTransactionMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateTransactionSchemaType;
		}) => {
			const url = generateLink({
				route: [
					API_ROUTES.TRANSACTION.BASE,
					API_ROUTES.TRANSACTION.UPDATE,
				],
				params: { id },
			});
			const { data: response } = await axios.patch<TransactionEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.TRANSACTION.BASE],
			});
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.ACCOUNT.BASE],
			});
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.CREDIT.BASE],
			});
		},
	});
};
