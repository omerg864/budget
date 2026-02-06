import { API_ROUTES } from '@shared/constants/routes.constants';
import type { UpdateUserSchemaType } from '@shared/schemas/user.schemas';
import type { LedgerUser } from '@shared/types/ledger.type';
import type { UserEntity } from '@shared/types/user.type';
import { generateLink } from '@shared/utils/route.utils.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';

export const useUserQuery = () => {
	return useQuery({
		queryKey: [API_ROUTES.USER.BASE, API_ROUTES.USER.ME],
		queryFn: async () => {
			const { data } = await axios.get<{ user: UserEntity }>(
				generateLink({
					route: [API_ROUTES.USER.BASE, API_ROUTES.USER.ME],
				}),
			);
			return data.user;
		},
	});
};

export const useUsersByLedgerQuery = (ledgerId: string | undefined) => {
	return useQuery({
		queryKey: [API_ROUTES.USER.BASE, API_ROUTES.USER.LEDGER, ledgerId],
		queryFn: async () => {
			if (!ledgerId) {
				return [];
			}
			const { data } = await axios.get<{ users: LedgerUser[] }>(
				generateLink({
					route: [API_ROUTES.USER.BASE, API_ROUTES.USER.LEDGER],
					params: { ledgerId },
				}),
			);
			return data.users;
		},
		enabled: !!ledgerId,
	});
};

export const useUpdateUserMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: UpdateUserSchemaType) => {
			const res = await axios.patch<{ user: UserEntity }>(
				generateLink({
					route: [API_ROUTES.USER.BASE, API_ROUTES.USER.UPDATE],
				}),
				data,
			);
			return res.data.user;
		},
		onSuccess: (updatedUser) => {
			queryClient.setQueryData(
				[API_ROUTES.USER.BASE, API_ROUTES.USER.ME],
				updatedUser,
			);
		},
	});
};
