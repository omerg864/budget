import { useUserQuery } from '@/api/user.api.ts';
import { convertCurrency } from '@shared/services/transaction.shared-service.ts';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { format, isToday, isYesterday } from 'date-fns';
import type { FC } from 'react';
import CurrencyFormatter from '../formatters/CurrencyFormatter.tsx';
import TransactionCard from './TransactionCard';

interface TransactionListProps {
	transactions: TransactionEntity[];
	onCardClick: (transaction: TransactionEntity) => void;
}

const TransactionList: FC<TransactionListProps> = ({
	transactions,
	onCardClick,
}) => {
	const { data: user } = useUserQuery();
	// Group transactions by date
	const groupedTransactions = transactions.reduce(
		(groups, transaction) => {
			const date = new Date(transaction.date);
			const dateKey = format(date, 'yyyy-MM-dd');
			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].push(transaction);
			return groups;
		},
		{} as Record<string, TransactionEntity[]>,
	);

	// Sort dates descending
	const sortedDates = Object.keys(groupedTransactions).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime(),
	);

	const getDateHeader = (dateString: string) => {
		const date = new Date(dateString);
		if (isToday(date)) return 'TODAY';
		if (isYesterday(date)) return 'YESTERDAY';
		return format(date, 'MMM d').toUpperCase();
	};

	if (!user) return null;

	return (
		<div className="space-y-6">
			{sortedDates.map((dateKey) => (
				<div
					key={dateKey}
					id={`date-${dateKey}`}
					className="scroll-mt-4"
				>
					<div className="flex items-center justify-between">
						<h4 className="text-sm font-medium text-gray-500 mb-3">
							{getDateHeader(dateKey)}
						</h4>
						<CurrencyFormatter
							amount={groupedTransactions[dateKey].reduce(
								(acc, transaction) =>
									acc + convertCurrency(transaction.amount),
								0,
							)}
							currency={user.defaultCurrency}
							className="text-sm font-medium text-gray-500 mb-3"
						/>
					</div>
					<div className="space-y-3">
						{groupedTransactions[dateKey].map((transaction) => (
							<TransactionCard
								key={transaction.id}
								transaction={transaction}
								onCardClick={onCardClick}
							/>
						))}
					</div>
				</div>
			))}
			{transactions.length === 0 && (
				<div className="text-center text-gray-500 py-10">
					No transactions found.
				</div>
			)}
		</div>
	);
};

export default TransactionList;
