import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { MonthlyAnalyticEntity } from '../../../../shared/types/analytic.type';
import type { LedgerUser } from '../../../../shared/types/ledger.type';
import { formatCurrency } from '../../utils/currency.utils';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

type Props = {
	data: MonthlyAnalyticEntity[];
};

export const UserAnalyticsChart = ({ data }: Props) => {
	const { t } = useTranslation('summary');

	const { users, incomeByUser, expenseByUser } = useMemo(() => {
		const userMap = new Map<string, LedgerUser>();
		const incomeMap: Record<string, number> = {};
		const expenseMap: Record<string, number> = {};

		data.forEach((analytic) => {
			if (analytic.users) {
				analytic.users.forEach((u) => {
					if (!userMap.has(u.id)) {
						userMap.set(u.id, u);
					}
				});
			}

			if (analytic.totalIncomeByUser) {
				Object.entries(analytic.totalIncomeByUser).forEach(
					([userId, amount]) => {
						incomeMap[userId] = (incomeMap[userId] || 0) + amount;
					},
				);
			}

			if (analytic.totalExpenseByUser) {
				Object.entries(analytic.totalExpenseByUser).forEach(
					([userId, amount]) => {
						expenseMap[userId] = (expenseMap[userId] || 0) + amount;
					},
				);
			}
		});

		return {
			users: Array.from(userMap.values()),
			incomeByUser: incomeMap,
			expenseByUser: expenseMap,
		};
	}, [data]);

	const chartData = useMemo(() => {
		const labels = users.map((u) => u.name);

		return {
			labels,
			datasets: [
				{
					label: t('analytics.income'),
					data: users.map((u) => incomeByUser[u.id] || 0),
					backgroundColor: 'rgba(34, 197, 94, 0.5)',
					borderColor: 'rgba(34, 197, 94, 1)',
					borderWidth: 1,
				},
				{
					label: t('analytics.expense'),
					data: users.map((u) => expenseByUser[u.id] || 0),
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
				},
			],
		};
	}, [users, incomeByUser, expenseByUser, t]);

	const currency = data[0]?.currency || 'ILS';

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: t('analytics.userDistribution'),
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						let label = context.dataset.label || '';
						if (label) {
							label += ': ';
						}
						if (context.parsed.y !== null) {
							label += formatCurrency(context.parsed.y, currency);
						}
						return label;
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: function (value: any) {
						return formatCurrency(value, currency);
					},
				},
			},
		},
	};

	if (users.length === 0) {
		return null;
	}

	return <Bar options={options} data={chartData} />;
};

export default UserAnalyticsChart;
