import { useAccountsQuery } from '@/api/account.api';
import { useGetAllReversedExchangeRates } from '@/api/currency.api';
import { useLedgerQuery } from '@/api/ledger.api';
import { useTransactionsQuery } from '@/api/transaction.api';
import { useUsersByLedgerQuery } from '@/api/user.api';
import CurrencyFormatter from '@/components/formatters/CurrencyFormatter';
import { Card } from '@/components/ui/card';
import { usePreferencesStore } from '@/stores/usePreferences';
import { aggregateTransactionsToAnalytic } from '@shared/utils/analytics.utils';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '../custom/Loader';
import ExpenseCategoryPieChart from './ExpenseCategoryPieChart';
import IncomeCategoryPieChart from './IncomeCategoryPieChart';
import UserAnalyticsChart from './UserAnalyticsChart';

const CurrentMonthTab: FC = () => {
	const { t } = useTranslation('summary');
	const ledgerId = usePreferencesStore((state) => state.ledgerId);
	const { data: ledger, isLoading: isLedgerLoading } = useLedgerQuery(
		ledgerId ?? undefined,
	);

	const { currentStart, currentEnd } = useMemo(() => {
		const start = DateTime.now().startOf('month').toJSDate();
		const end = DateTime.now().endOf('month').toJSDate();
		return { currentStart: start, currentEnd: end };
	}, []);

	const { data: currentTransactions = [], isLoading: isTransactionsLoading } =
		useTransactionsQuery({
			ledgerId: ledger?.id || '',
			startDate: currentStart,
			endDate: currentEnd,
		});

	const { data: ledgerUsers = [], isLoading: isUsersLoading } =
		useUsersByLedgerQuery(ledger?.id);

	const { data: exchangeRates, isLoading: isRatesLoading } =
		useGetAllReversedExchangeRates(ledger?.currency);

	const { data: accounts = [], isLoading: isAccountsLoading } =
		useAccountsQuery(ledger?.id);

	const analytics = useMemo(() => {
		if (!ledger) {
			return [];
		}
		if (
			!isLedgerLoading &&
			!isTransactionsLoading &&
			!isUsersLoading &&
			!isRatesLoading &&
			!isAccountsLoading &&
			exchangeRates
		) {
			const normalizedTransactions = currentTransactions.map((t) => {
				if (t.currency !== ledger?.currency) {
					const rate = exchangeRates[t.currency];
					if (rate) {
						return {
							...t,
							amount: t.amount * rate,
							currency: ledger.currency,
						};
					}
				}
				return t;
			});

			return [
				aggregateTransactionsToAnalytic(
					normalizedTransactions,
					ledger,
					currentStart,
					ledgerUsers,
					accounts,
					exchangeRates,
				),
			];
		}
		return [];
	}, [
		currentTransactions,
		ledger,
		currentStart,
		ledgerUsers,
		accounts,
		isTransactionsLoading,
		isUsersLoading,
		exchangeRates,
		isRatesLoading,
		isLedgerLoading,
		isAccountsLoading,
	]);

	const analytic = analytics[0];
	const totalIncome = analytic?.totalIncome || 0;
	const totalExpense = analytic?.totalExpense || 0;
	const totalBalance = analytic?.totalBalance || 0;
	const totalAssets = analytic?.totalAssets || 0;

	if (
		isTransactionsLoading ||
		isUsersLoading ||
		isRatesLoading ||
		isLedgerLoading ||
		!ledger
	) {
		return <Loader />;
	}

	if (
		analytics.length === 0 ||
		(!analytic && !isTransactionsLoading && !isUsersLoading)
	) {
		return (
			<div className="text-center text-gray-400 py-10">{t('noData')}</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-3 mb-4">
				<Card className="p-4 rounded-2xl border-0 shadow-sm bg-green-50">
					<span className="text-xs text-green-600 font-bold uppercase">
						{t('income')}
					</span>
					<div className="text-xl font-bold text-green-700">
						<CurrencyFormatter
							amount={totalIncome}
							currency={ledger.currency}
						/>
					</div>
				</Card>
				<Card className="p-4 rounded-2xl border-0 shadow-sm bg-red-50">
					<span className="text-xs text-red-600 font-bold uppercase">
						{t('expense')}
					</span>
					<div className="text-xl font-bold text-red-700">
						<CurrencyFormatter
							amount={totalExpense}
							currency={ledger.currency}
						/>
					</div>
				</Card>
			</div>

			<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white mb-4">
				<div className="flex justify-between items-start mb-4">
					<div>
						<span className="text-sm text-gray-500">
							{t('netBalance')}
						</span>
						<div
							className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}
						>
							<CurrencyFormatter
								amount={totalBalance}
								currency={ledger.currency}
							/>
						</div>
					</div>
					<div className="text-right">
						<span className="text-sm text-gray-500">
							{t('totalAssets')}
						</span>
						<div className="text-xl font-bold text-blue-600">
							<CurrencyFormatter
								amount={totalAssets}
								currency={ledger.currency}
							/>
						</div>
					</div>
				</div>
			</Card>
			<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white">
				<h3 className="font-bold text-lg mb-4">
					{t('expensesByCategory')}
				</h3>
				<ExpenseCategoryPieChart data={analytics} />
			</Card>
			<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white">
				<h3 className="font-bold text-lg mb-4">
					{t('incomeByCategory')}
				</h3>
				<IncomeCategoryPieChart data={analytics} />
			</Card>
			<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white">
				<h3 className="font-bold text-lg mb-4">
					{t('analytics.userDistribution')}
				</h3>
				<UserAnalyticsChart data={analytics} />
			</Card>
		</div>
	);
};

export default CurrentMonthTab;
