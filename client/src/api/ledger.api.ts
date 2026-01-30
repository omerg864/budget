import { API_ROUTES } from '@shared/constants/routes.constants';
import type { LedgerEntity } from '@shared/types/ledger.type';
import { generateLink } from '@shared/utils/route.utils';
import { useQuery } from '@tanstack/react-query';
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
