import { useTransactionsQuery } from '@/api/transaction.api';
import AddButton from '@/components/custom/AddButton.tsx';
import { Loader } from '@/components/custom/Loader.tsx';
import CurrencyFormatter from '@/components/formatters/CurrencyFormatter.tsx';
import PageDisplay from '@/components/layout/PageDisplay.tsx';
import PageTitle from '@/components/layout/PageTitle';
import TransactionCalendar from '@/components/transaction/TransactionCalendar';
import { TransactionForm } from '@/components/transaction/TransactionForm';
import TransactionList from '@/components/transaction/TransactionList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreferencesStore } from '@/stores/usePreferences';
import { convertCurrency } from '@shared/services/transaction.shared-service.ts';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { useMemoizedFn } from 'ahooks';
import {
	addMonths,
	endOfMonth,
	format,
	startOfMonth,
	subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Transactions = () => {
	const { t } = useTranslation('transactions');
	const { ledgerId } = usePreferencesStore();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingTransaction, setEditingTransaction] =
		useState<TransactionEntity | null>(null);

	const startDate = startOfMonth(currentDate);
	const endDate = endOfMonth(currentDate);

	const { data: transactions = [], isLoading } = useTransactionsQuery({
		ledgerId: ledgerId || '',
		startDate,
		endDate,
	});

	const total = useMemo(() => {
		return transactions.reduce((acc, transaction) => {
			return (
				acc +
				convertCurrency(
					transaction.amount *
						(transaction.type === 'expense' ? -1 : 1),
				)
			);
		}, 0);
	}, [transactions]);

	const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
	const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

	const handleAddTransaction = useMemoizedFn(() => {
		setEditingTransaction(null);
		setIsFormOpen(true);
	});

	const handleEditTransaction = useMemoizedFn(
		(transaction: TransactionEntity) => {
			setEditingTransaction(transaction);
			setIsFormOpen(true);
		},
	);

	return (
		<PageDisplay
			isLoading={isLoading}
			fixed={
				<>
					<PageTitle title={t('transactions')}>
						<AddButton onAdd={handleAddTransaction} />
					</PageTitle>
					<div className="flex items-center justify-between my-6">
						<Button
							variant="ghost"
							size="icon"
							onClick={handlePrevMonth}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<div className="font-semibold text-lg text-center">
							<span className="block">
								{format(currentDate, 'MMMM yyyy')}
							</span>
							<CurrencyFormatter amount={total} currency="ILS" />
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNextMonth}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</>
			}
		>
			<div className="flex-1 overflow-hidden flex flex-col">
				<Tabs
					defaultValue="list"
					className="w-full flex-1 flex flex-col h-full"
				>
					<TabsList className="grid w-full grid-cols-2 mb-6 shrink-0">
						<TabsTrigger value="list">{t('list')}</TabsTrigger>
						<TabsTrigger value="calendar">
							{t('calendar')}
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value="list"
						className="flex-1 overflow-y-auto pb-24"
					>
						{isLoading ? (
							<Loader />
						) : (
							<TransactionList
								transactions={transactions}
								onCardClick={handleEditTransaction}
							/>
						)}
					</TabsContent>
					<TabsContent
						value="calendar"
						className="flex-1 overflow-y-auto pb-24"
					>
						{isLoading ? (
							<Loader />
						) : (
							<TransactionCalendar
								transactions={transactions}
								onCardClick={handleEditTransaction}
								month={currentDate}
							/>
						)}
					</TabsContent>
				</Tabs>
			</div>
			<TransactionForm
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				transactionToEdit={editingTransaction}
			/>
		</PageDisplay>
	);
};

export default Transactions;
