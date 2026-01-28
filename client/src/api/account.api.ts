import { API_ROUTES } from '@shared/constants/routes.constants';
import type {
	CreateAccountSchemaType,
	UpdateAccountSchemaType,
} from '@shared/schemas/account.schemas.ts';
import type { AccountEntity } from '@shared/types/account.type';
import type { CreditEntity } from '@shared/types/credit.type';
import { generateLink } from '@shared/utils/route.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';

export const useAccountsQuery = (ledgerId?: string) => {
	return useQuery({
		queryKey: [
			API_ROUTES.ACCOUNT.BASE,
			API_ROUTES.ACCOUNT.FIND_ALL,
			ledgerId,
		],
		queryFn: async () => {
			if (!ledgerId) return [];
			const url = generateLink({
				route: [API_ROUTES.ACCOUNT.BASE, API_ROUTES.ACCOUNT.FIND_ALL],
				params: { ledgerId },
			});
			const { data } = await axios.get<AccountEntity[]>(url);
			return data;
		},
		enabled: !!ledgerId,
	});
};

export const useCreditsQuery = (ledgerId?: string) => {
	return useQuery({
		queryKey: [
			API_ROUTES.CREDIT.BASE,
			API_ROUTES.CREDIT.FIND_ALL,
			ledgerId,
		],
		queryFn: async () => {
			if (!ledgerId) return [];
			const url = generateLink({
				route: [API_ROUTES.CREDIT.BASE, API_ROUTES.CREDIT.FIND_ALL],
				params: { ledgerId },
			});
			const { data } = await axios.get<CreditEntity[]>(url);
			return data;
		},
		enabled: !!ledgerId,
	});
};

export const useCreateAccountMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateAccountSchemaType) => {
			const url = generateLink({
				route: [API_ROUTES.ACCOUNT.BASE, API_ROUTES.ACCOUNT.CREATE],
			});
			const { data: response } = await axios.post<AccountEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.ACCOUNT.BASE],
			});
		},
	});
};

export const useUpdateAccountMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateAccountSchemaType;
		}) => {
			const url = generateLink({
				route: [API_ROUTES.ACCOUNT.BASE, API_ROUTES.ACCOUNT.UPDATE],
				params: { id },
			});
			const { data: response } = await axios.patch<AccountEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.ACCOUNT.BASE],
			});
		},
	});
};
