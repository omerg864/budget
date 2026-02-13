import type { MonthlyAnalyticEntity } from '@shared/types/analytic.type';
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/currency.utils';
import './ChartConfig';

interface IncomeCategoryPieChartProps {
	data: MonthlyAnalyticEntity[]; // Can be one or multiple (if multiple, we sum them)
}

const IncomeCategoryPieChart: React.FC<IncomeCategoryPieChartProps> = ({
	data,
}) => {
	const aggregatedCategories = useMemo(() => {
		const categoriesMap: Record<string, number> = {};
		const categoryNames: Record<string, string> = {};

		data.forEach((item) => {
			(item.categories || []).forEach((cat) => {
				categoryNames[cat.id] = cat.name;
			});

			Object.entries(item.totalIncomeByCategory || {}).forEach(
				([catId, amount]) => {
					categoriesMap[catId] = (categoriesMap[catId] || 0) + amount;
				},
			);
		});
		return { categoriesMap, categoryNames };
	}, [data]);

	const sortedCategories = Object.entries(aggregatedCategories.categoriesMap)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 6); // Top 6 categories

	const chartData = {
		labels: sortedCategories.map(
			([catId]) => aggregatedCategories.categoryNames[catId] || 'Unknown',
		),
		datasets: [
			{
				data: sortedCategories.map(([, amount]) => amount),
				backgroundColor: [
					'#3b82f6', // blue-500
					'#ef4444', // red-500
					'#eab308', // yellow-500
					'#10b981', // green-500
					'#a855f7', // purple-500
					'#f97316', // orange-500
					'#6b7280', // gray-500
				],
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		cutout: '60%',
		plugins: {
			tooltip: {
				callbacks: {
					label: (context: any) => {
						const label = context.label || '';
						const value = context.parsed;
						const currency = data[0]?.currency || 'ILS';
						const formattedValue = formatCurrency(value, currency);
						return `${label}: ${formattedValue}`;
					},
				},
			},
			legend: {
				position: 'right' as const,
				labels: {
					usePointStyle: true,
				},
			},
		},
	};

	return (
		<div className="h-64 w-full">
			<Doughnut data={chartData} options={options} />
		</div>
	);
};

export default IncomeCategoryPieChart;
