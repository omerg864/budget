import { API_ROUTES } from '@shared/constants/routes.constants';
import type {
	CreateCreditSchemaType,
	UpdateCreditSchemaType,
} from '@shared/schemas/credit.schemas';
import type { CreditEntity } from '@shared/types/credit.type';
import { generateLink } from '@shared/utils/route.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';

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

export const useCreateCreditMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateCreditSchemaType) => {
			const url = generateLink({
				route: [API_ROUTES.CREDIT.BASE, API_ROUTES.CREDIT.CREATE],
			});
			const { data: response } = await axios.post<CreditEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.CREDIT.BASE],
			});
			// Also invalidate accounts as credits might affect dashboard totals if they were part of calculation,
			// though strictly speaking they are separate.
			// But for safety let's invalidate account related things if needed.
			// Actually total assets calculation in Accounts.tsx uses both lists.
			// The query keys are separate.
		},
	});
};

export const useUpdateCreditMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateCreditSchemaType;
		}) => {
			const url = generateLink({
				route: [API_ROUTES.CREDIT.BASE, API_ROUTES.CREDIT.UPDATE],
				params: { id },
			});
			const { data: response } = await axios.patch<CreditEntity>(
				url,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.CREDIT.BASE],
			});
		},
	});
};
