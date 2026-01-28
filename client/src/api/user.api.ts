import { API_ROUTES } from '@shared/constants/routes.constants';
import type { UserEntity } from '@shared/types/user.type';
import { generateLink } from '@shared/utils/route.utils.ts';
import { useQuery } from '@tanstack/react-query';
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
			const { data } = await axios.get<{ users: UserEntity[] }>(
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
