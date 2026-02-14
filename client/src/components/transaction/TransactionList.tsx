import { useGetAllReversedExchangeRates } from '@/api/currency.api';
import { useLedgerQuery } from '@/api/ledger.api';
import { useUserQuery } from '@/api/user.api.ts';
import { useDir } from '@/hooks/useDir';
import { usePreferencesStore } from '@/stores/usePreferences';
import type { SupportedCurrencies } from '@shared/constants/currency.constants';
import {
	convertCurrency,
	getTransactionActualAmount,
} from '@shared/services/transaction.shared-service';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { useMemoizedFn } from 'ahooks';
import { DateTime } from 'luxon';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import CurrencyFormatter from '../formatters/CurrencyFormatter';
import TransactionCard from './TransactionCard';

interface TransactionListProps {
	transactions: TransactionEntity[];
	onCardClick: (transaction: TransactionEntity) => void;
}

const TransactionList: FC<TransactionListProps> = ({
	transactions,
	onCardClick,
}) => {
	const { t, i18n } = useTranslation('transactions');
	const dir = useDir();
	const { ledgerId } = usePreferencesStore();
	const { data: ledger } = useLedgerQuery(ledgerId ?? undefined);
	const { data: exchangeRates = {} as Record<SupportedCurrencies, number> } =
		useGetAllReversedExchangeRates(ledger?.currency);
	const { data: user } = useUserQuery();

	// Group transactions by date
	const { groupedTransactions, sortedDates, totalPerDate } = useMemo(() => {
		const groupedTransactions = transactions.reduce(
			(groups, transaction) => {
				const date = DateTime.fromJSDate(new Date(transaction.date));
				const dateKey = date.toFormat('yyyy-MM-dd');
				if (!groups[dateKey]) {
					groups[dateKey] = [];
				}
				groups[dateKey].push(transaction);
				return groups;
			},
			{} as Record<string, TransactionEntity[]>,
		);
		const sortedDates = Object.keys(groupedTransactions).sort(
			(a, b) => new Date(b).getTime() - new Date(a).getTime(),
		);
		const totalPerDate = sortedDates.reduce(
			(acc, dateKey) => {
				const total = groupedTransactions[dateKey].reduce(
					(acc, transaction) => {
						const exchangeRate =
							exchangeRates[transaction.currency];
						const amount = convertCurrency(
							getTransactionActualAmount(transaction),
							exchangeRate,
						);
						return acc + amount;
					},
					0,
				);
				acc[dateKey] = total;
				return acc;
			},
			{} as Record<string, number>,
		);
		return { groupedTransactions, sortedDates, totalPerDate };
	}, [transactions, exchangeRates]);

	const getDateHeader = useMemoizedFn((dateString: string) => {
		const date = DateTime.fromISO(dateString).setLocale(i18n.language);
		const now = DateTime.now().setLocale(i18n.language);

		if (date.hasSame(now, 'day')) return t('today').toUpperCase();
		if (date.hasSame(now.minus({ days: 1 }), 'day'))
			return t('yesterday').toUpperCase();
		return date.toFormat('MMM d').toUpperCase();
	});

	if (!user || !ledger) return null;

	return (
		<div className="space-y-6">
			{sortedDates.map((dateKey) => (
				<div
					key={dateKey}
					id={`date-${dateKey}`}
					className="scroll-mt-4"
					dir={dir}
				>
					<div className="flex items-center justify-between">
						<h4 className="text-sm font-medium text-gray-500 mb-3">
							{getDateHeader(dateKey)}
						</h4>
						<CurrencyFormatter
							amount={totalPerDate[dateKey] ?? 0}
							currency={ledger.currency}
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
					{t('noTransactionsFound')}
				</div>
			)}
		</div>
	);
};

export default TransactionList;
