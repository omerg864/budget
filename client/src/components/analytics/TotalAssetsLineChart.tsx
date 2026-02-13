import type { MonthlyAnalyticEntity } from '@shared/types/analytic.type';
import { DateTime } from 'luxon';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/currency.utils';
import './ChartConfig';

interface TotalAssetsLineChartProps {
	data: MonthlyAnalyticEntity[];
}

const TotalAssetsLineChart: React.FC<TotalAssetsLineChartProps> = ({
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
				label: 'Total Assets',
				data: sortedData.map((d) => d.totalAssets),
				borderColor: '#3b82f6', // blue-500
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				fill: true,
				tension: 0.4,
				pointRadius: 4,
				pointHoverRadius: 6,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
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
				},
			},
			legend: {
				display: false,
			},
		},
		scales: {
			y: {
				beginAtZero: false, // Assets don't necessarily start at 0
			},
		},
	};

	return (
		<div className="h-64 w-full">
			<Line data={chartData} options={options} />
		</div>
	);
};

export default TotalAssetsLineChart;
