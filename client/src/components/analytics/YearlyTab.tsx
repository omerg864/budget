import { useMonthlyAnalyticsQuery } from '@/api/analytics.api';
import { useGetAllReversedExchangeRates } from '@/api/currency.api';
import { useLedgerQuery } from '@/api/ledger.api';
import CurrencyFormatter from '@/components/formatters/CurrencyFormatter';
import { Card } from '@/components/ui/card';
import { usePreferencesStore } from '@/stores/usePreferences';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { maxBy } from 'lodash';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '../custom/Loader';
import ExpenseCategoryPieChart from './ExpenseCategoryPieChart';
import IncomeCategoryPieChart from './IncomeCategoryPieChart';
import IncomeExpenseBarChart from './IncomeExpenseBarChart';
import TotalAssetsLineChart from './TotalAssetsLineChart';
import UserAnalyticsChart from './UserAnalyticsChart';

interface YearlyTabProps {
	date: Date;
}

const YearlyTab: FC<YearlyTabProps> = ({ date }) => {
	const { t } = useTranslation('summary');
	const ledgerId = usePreferencesStore((state) => state.ledgerId);
	const { data: ledger, isLoading: isLedgerLoading } = useLedgerQuery(
		ledgerId ?? undefined,
	);
	const luxonDate = DateTime.fromJSDate(date);
	const start = luxonDate.startOf('year').toJSDate();
	const end = luxonDate.endOf('year').toJSDate();

	const { data: analytics = [], isLoading } = useMonthlyAnalyticsQuery(
		ledger?.id,
		start,
		end,
	);

	const { data: exchangeRates, isLoading: isRatesLoading } =
		useGetAllReversedExchangeRates(ledger?.currency);

	const { totalIncome, totalExpense, totalBalance, totalAssets } =
		useMemo(() => {
			if (!exchangeRates) {
				return {
					totalIncome: 0,
					totalExpense: 0,
					totalBalance: 0,
					totalAssets: 0,
				};
			}

			const income = analytics.reduce((acc, curr) => {
				let amount = curr.totalIncome;
				if (curr.currency !== ledger?.currency) {
					const rate = exchangeRates[curr.currency];
					if (rate) amount *= rate;
				}
				return acc + amount;
			}, 0);

			const expense = analytics.reduce((acc, curr) => {
				let amount = curr.totalExpense;
				if (curr.currency !== ledger?.currency) {
					const rate = exchangeRates[curr.currency];
					if (rate) amount *= rate;
				}
				return acc + amount;
			}, 0);

			const balance = analytics.reduce((acc, curr) => {
				let amount = curr.totalBalance;
				if (curr.currency !== ledger?.currency) {
					const rate = exchangeRates[curr.currency];
					if (rate) amount *= rate;
				}
				return acc + amount;
			}, 0);

			const latestAnalytic =
				analytics.length > 0
					? maxBy(analytics, (a) => new Date(a.month).getTime())
					: null;

			let assets = latestAnalytic?.totalAssets || 0;
			if (
				latestAnalytic &&
				latestAnalytic.currency !== ledger?.currency
			) {
				const rate = exchangeRates[latestAnalytic.currency];
				if (rate) assets *= rate;
			}

			return {
				totalIncome: income,
				totalExpense: expense,
				totalBalance: balance,
				totalAssets: assets,
			};
		}, [analytics, exchangeRates, ledger]);

	const currency = ledger?.currency || SupportedCurrencies.ILS;

	if (isLoading || isRatesLoading || isLedgerLoading || !ledger) {
		return <Loader />;
	}

	if (analytics.length === 0) {
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
							currency={currency}
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
							currency={currency}
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
								currency={currency}
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
								currency={currency}
							/>
						</div>
					</div>
				</div>
			</Card>

			<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white">
				<h3 className="font-bold text-lg mb-4">
					{t('incomeVsExpense')}
				</h3>
				<IncomeExpenseBarChart data={analytics} />
			</Card>

			<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white">
				<h3 className="font-bold text-lg mb-4">
					{t('totalAssetsOverTime')}
				</h3>
				<TotalAssetsLineChart data={analytics} />
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
				<UserAnalyticsChart data={analytics} />
			</Card>
		</div>
	);
};

export default YearlyTab;
