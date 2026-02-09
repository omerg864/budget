import { useLedgerQuery } from '@/api/ledger.api';
import { useTransactionsQuery } from '@/api/transaction.api';
import CurrencyFormatter from '@/components/formatters/CurrencyFormatter';
import PageTitle from '@/components/layout/PageTitle';
import LanguageSelector from '@/components/selectors/LanguageSelector';
import LedgerSelector from '@/components/selectors/LedgerSelector';
import TransactionCard from '@/components/transaction/TransactionCard';
import { Card } from '@/components/ui/card';
import { usePreferencesStore } from '@/stores/usePreferences';
import { SupportedCurrencies } from '@shared/constants/currency.constants.ts';
import { ArrowUpRight } from 'lucide-react';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

// Mock components for charts to match design - Removed unused NetWorthChart

const Summary: FC = () => {
	const { t } = useTranslation('summary');
	const { ledgerId, setLedgerId } = usePreferencesStore();
	const { data: ledger } = useLedgerQuery(ledgerId ?? undefined);

	const currentDate = new Date();
	const startDate = DateTime.fromJSDate(currentDate)
		.startOf('month')
		.toJSDate();
	const endDate = DateTime.fromJSDate(currentDate).endOf('month').toJSDate();

	const { data: transactions = [] } = useTransactionsQuery({
		ledgerId: ledgerId || '',
		startDate,
		endDate,
	});

	// Mock calculations
	const totalSpent = 5400; // This should be calculated from actual data in real app
	const budgetLimit = 7500;

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{/* Header */}
			<PageTitle title={t('title')} className="mb-4">
				<div className="flex gap-2">
					<LanguageSelector
						className="w-fit"
						containerClassName="w-fit"
					/>
					<LedgerSelector
						value={ledgerId ?? undefined}
						onValueChange={setLedgerId}
						className="w-fit"
						containerClassName="w-fit"
					/>
				</div>
			</PageTitle>

			<div className="flex-1 overflow-y-auto space-y-4 pb-4 px-1 -mx-1">
				{/* Net Worth Card */}
				<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white shrink-0">
					<div className="flex justify-between items-start">
						<div>
							<p className="text-sm text-gray-500">
								{t('totalNetWorth')}
							</p>
							<div className="text-3xl font-bold mt-1">
								<CurrencyFormatter
									amount={124500}
									currency={
										ledger?.currency ||
										SupportedCurrencies.ILS
									}
								/>
							</div>
						</div>
						<div className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
							<ArrowUpRight className="h-3 w-3" />
							+2.4%
						</div>
					</div>
					{/* Mock Graph */}
					<div className="mt-6 relative h-24 w-full">
						<svg
							className="w-full h-full overflow-visible"
							viewBox="0 0 100 40"
							preserveAspectRatio="none"
						>
							<path
								d="M0 35 C 20 35, 30 20, 50 25 C 70 30, 80 10, 100 5"
								fill="none"
								stroke="#D1D5DB"
								strokeWidth="2"
								vectorEffect="non-scaling-stroke"
							/>
						</svg>
						{/* Vertical bars (mock) */}
						<div className="absolute inset-0 flex justify-between items-end px-2">
							{[30, 40, 35, 60, 55, 70, 45].map((h, i) => (
								<div
									key={i}
									className={`w-1.5 rounded-t-full ${
										i === 6 ? 'bg-black' : 'bg-gray-100'
									}`}
									style={{ height: `${h}%` }}
								/>
							))}
						</div>
					</div>
				</Card>

				{/* Monthly Budget Card */}
				<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white shrink-0">
					<div className="flex justify-between items-center mb-4">
						<h3 className="font-bold text-lg">
							{t('monthlyBudget')}
						</h3>
						<span className="text-gray-400 text-sm">
							April 2024
						</span>
					</div>
					<div className="flex justify-between items-center mb-3">
						<span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
							{t('onTrack')}
						</span>
						<span className="text-blue-600 font-bold text-sm">
							72%
						</span>
					</div>
					<div className="flex justify-between items-center mt-3 text-sm text-gray-500 font-medium">
						<span>
							{t('spent', {
								amount: new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'ILS',
								}).format(totalSpent),
							}).replace('ILS', '₪')}
						</span>
						<span>
							{t('limit', {
								amount: new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'ILS',
								}).format(budgetLimit),
							}).replace('ILS', '₪')}
						</span>
					</div>
				</Card>

				{/* Top Expenses Card */}
				<Card className="p-6 rounded-3xl border-0 shadow-sm bg-white shrink-0">
					<h3 className="font-bold text-lg mb-6">
						{t('topExpenses')}
					</h3>
					<div className="flex items-center gap-8">
						<div className="space-y-3 flex-1">
							{[
								{
									label: 'Food & Dining',
									value: '40%',
									color: 'bg-black',
								},
								{
									label: 'Rent',
									value: '24%',
									color: 'bg-gray-400',
								},
								{
									label: 'Transport',
									value: '16%',
									color: 'bg-gray-200',
								},
							].map((item, i) => (
								<div
									key={i}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-2">
										<div
											className={`w-3 h-3 rounded-full ${item.color}`}
										/>
										<span className="text-sm font-medium">
											{item.label}
										</span>
									</div>
									<span className="font-bold">
										{item.value}
									</span>
								</div>
							))}
						</div>
					</div>
				</Card>

				{/* Recent Activity */}
				<div className="shrink-0">
					<div className="flex justify-between items-center mb-4 px-2">
						<h3 className="font-bold text-lg">
							{t('recentActivity')}
						</h3>
						<Link
							to="/transactions"
							className="text-blue-500 text-sm font-medium"
						>
							{t('seeAll')}
						</Link>
					</div>
					<div className="space-y-3">
						{transactions.slice(0, 3).map((transaction) => (
							<TransactionCard
								key={transaction.id}
								transaction={transaction}
								onCardClick={() => {}}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Summary;
