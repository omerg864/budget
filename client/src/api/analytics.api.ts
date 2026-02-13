import axios from '@/lib/clients/axios.client';
import { API_ROUTES } from '@shared/constants/routes.constants';
import type {
	MonthlyAnalyticEntity,
	YearlyAnalyticEntity,
} from '@shared/types/analytic.type';
import { generateLink } from '@shared/utils/route.utils';
import { useQuery } from '@tanstack/react-query';

export const AnalyticsAPI = {
	getMonthly: async (ledgerId: string, start: Date, end: Date) => {
		const { data } = await axios.get<MonthlyAnalyticEntity[]>(
			generateLink({
				route: [
					API_ROUTES.ANALYTICS.BASE,
					API_ROUTES.ANALYTICS.GET_MONTHLY,
				],
				params: { ledgerId },
				query: {
					start: start.toISOString(),
					end: end.toISOString(),
				},
			}),
		);
		return data;
	},

	getYearly: async (ledgerId: string, start: number, end: number) => {
		const url = generateLink({
			route: [API_ROUTES.ANALYTICS.BASE, API_ROUTES.ANALYTICS.GET_YEARLY],
			params: { ledgerId },
			query: {
				start: start.toString(),
				end: end.toString(),
			},
		});
		const { data } = await axios.get<YearlyAnalyticEntity[]>(url);
		return data;
	},
};

export const useMonthlyAnalyticsQuery = (
	ledgerId?: string,
	start?: Date,
	end?: Date,
) => {
	return useQuery({
		queryKey: [
			API_ROUTES.ANALYTICS.BASE,
			API_ROUTES.ANALYTICS.GET_MONTHLY,
			ledgerId,
			start?.toISOString(),
			end?.toISOString(),
		],
		queryFn: async () => {
			if (!ledgerId || !start || !end) return [];
			return AnalyticsAPI.getMonthly(ledgerId, start, end);
		},
		enabled: !!ledgerId && !!start && !!end,
	});
};

export const useYearlyAnalyticsQuery = (
	ledgerId?: string,
	start?: number,
	end?: number,
) => {
	return useQuery({
		queryKey: [
			API_ROUTES.ANALYTICS.BASE,
			API_ROUTES.ANALYTICS.GET_YEARLY,
			ledgerId,
			start?.toString(),
			end?.toString(),
		],
		queryFn: async () => {
			if (!ledgerId || !start || !end) return [];
			return AnalyticsAPI.getYearly(ledgerId, start, end);
		},
		enabled: !!ledgerId && !!start && !!end,
	});
};
