import type { MonthlyAnalyticEntity } from '@shared/types/analytic.type';
import { DateTime } from 'luxon';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/currency.utils';
import './ChartConfig'; // Register charts

interface IncomeExpenseBarChartProps {
	data: MonthlyAnalyticEntity[];
}

const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({
	data,
}) => {
	const sortedData = [...data].sort(
		(a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
	);

	const labels = sortedData.map((d) =>
		DateTime.fromJSDate(new Date(d.month)).toFormat('MMM'),
	);

	const chartData = {
		labels,
		datasets: [
			{
				label: 'Income',
				data: sortedData.map((d) => d.totalIncome),
				backgroundColor: 'rgba(34, 197, 94, 0.7)', // green-500
				borderColor: 'rgba(34, 197, 94, 1)',
				borderWidth: 1,
				borderRadius: 4,
			},
			{
				label: 'Expense',
				data: sortedData.map((d) => d.totalExpense),
				backgroundColor: 'rgba(239, 68, 68, 0.7)', // red-500
				borderColor: 'rgba(239, 68, 68, 1)',
				borderWidth: 1,
				borderRadius: 4,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			tooltip: {
				callbacks: {
					label: (context: any) => {
						let label = context.dataset.label || '';
						if (label) {
							label += ': ';
						}
						if (context.parsed.y !== null) {
							const currency =
								sortedData[context.dataIndex]?.currency ||
								'ILS';
							label += formatCurrency(context.parsed.y, currency);
						}
						return label;
					},
					afterBody: (context: any[]) => {
						const index = context[0].dataIndex;
						const item = sortedData[index];
						const balance = item.totalBalance;
						const currency = item.currency || 'ILS';
						const formattedBalance = formatCurrency(
							balance,
							currency,
						);
						return `Balance: ${formattedBalance}`;
					},
				},
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<div className="h-64 w-full">
			<Bar data={chartData} options={options} />
		</div>
	);
};

export default IncomeExpenseBarChart;
