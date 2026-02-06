import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { API_ROUTES } from '@shared/constants/routes.constants';
import { generateLink } from '@shared/utils/route.utils';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';

export const useGetExchangeRate = (
	from: SupportedCurrencies | undefined,
	to: SupportedCurrencies | undefined,
	options?: UseQueryOptions<number>,
) => {
	return useQuery({
		queryKey: [
			API_ROUTES.CURRENCY.BASE,
			API_ROUTES.CURRENCY.GET_EXCHANGE_RATE,
			from,
			to,
		],
		queryFn: async () => {
			const url = generateLink({
				route: [
					API_ROUTES.CURRENCY.BASE,
					API_ROUTES.CURRENCY.GET_EXCHANGE_RATE,
				],
				params: {},
				query: { from: from!, to: to! },
			});
			const { data } = await axios.get<number>(url);
			return data;
		},
		...options,
		enabled: !!from && !!to && (options?.enabled ?? true),
	});
};

export const useGetAllExchangeRates = (
	from: SupportedCurrencies | undefined,
	options?: UseQueryOptions<Record<SupportedCurrencies, number>>,
) => {
	return useQuery({
		queryKey: [
			API_ROUTES.CURRENCY.BASE,
			API_ROUTES.CURRENCY.GET_ALL_EXCHANGE_RATES,
			from,
		],
		queryFn: async () => {
			const url = generateLink({
				route: [
					API_ROUTES.CURRENCY.BASE,
					API_ROUTES.CURRENCY.GET_ALL_EXCHANGE_RATES,
				],
				params: {},
				query: { from: from! },
			});
			const { data } =
				await axios.get<Record<SupportedCurrencies, number>>(url);
			return data;
		},
		...options,
		enabled: !!from && (options?.enabled ?? true),
	});
};

export const useGetAllReversedExchangeRates = (
	to: SupportedCurrencies | undefined,
	options?: UseQueryOptions<Record<SupportedCurrencies, number>>,
) => {
	return useQuery({
		queryKey: [
			API_ROUTES.CURRENCY.BASE,
			API_ROUTES.CURRENCY.GET_ALL_REVERSED_EXCHANGE_RATES,
			to,
		],
		queryFn: async () => {
			const url = generateLink({
				route: [
					API_ROUTES.CURRENCY.BASE,
					API_ROUTES.CURRENCY.GET_ALL_REVERSED_EXCHANGE_RATES,
				],
				params: {},
				query: { to: to! },
			});
			const { data } =
				await axios.get<Record<SupportedCurrencies, number>>(url);
			return data;
		},
		...options,
		enabled: !!to && (options?.enabled ?? true),
	});
};
