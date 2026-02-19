import { useTransactionsQuery } from '@/api/transaction.api';
import AddButton from '@/components/custom/AddButton.tsx';
import BackArrow from '@/components/custom/BackArrow';
import ForwardArrow from '@/components/custom/ForwardArrow';
import { Loader } from '@/components/custom/Loader.tsx';
import PageDisplay from '@/components/layout/PageDisplay.tsx';
import PageTitle from '@/components/layout/PageTitle';
import TransactionCalendar from '@/components/transaction/TransactionCalendar';
import { TransactionForm } from '@/components/transaction/TransactionForm';
import TransactionList from '@/components/transaction/TransactionList';
import UpcomingTransactions from '@/components/transaction/UpcomingTransactions';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreferencesStore } from '@/stores/usePreferences';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { useMemoizedFn } from 'ahooks';
import { CalendarIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Transactions = () => {
	const { t, i18n } = useTranslation('transactions');
	const { ledgerId } = usePreferencesStore();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingTransaction, setEditingTransaction] =
		useState<TransactionEntity | null>(null);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('list');

	const startDate = DateTime.fromJSDate(currentDate)
		.startOf('month')
		.toJSDate();
	const endDate = DateTime.fromJSDate(currentDate).endOf('month').toJSDate();

	const { data: transactions = [], isLoading } = useTransactionsQuery({
		ledgerId: ledgerId || '',
		startDate,
		endDate,
	});

	const handlePrevMonth = () =>
		setCurrentDate((prev) =>
			DateTime.fromJSDate(prev).minus({ months: 1 }).toJSDate(),
		);
	const handleNextMonth = () =>
		setCurrentDate((prev) =>
			DateTime.fromJSDate(prev).plus({ months: 1 }).toJSDate(),
		);

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

	const handleDateSelect = (newDate: Date | undefined) => {
		if (newDate) {
			const dateKey = DateTime.fromJSDate(newDate).toFormat('yyyy-MM-dd');
			const element = document.getElementById(`date-${dateKey}`);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
			setIsCalendarOpen(false);
		}
	};

	return (
		<PageDisplay
			isLoading={isLoading}
			fixed={
				<>
					<PageTitle title={t('transactions')}>
						<AddButton onAdd={handleAddTransaction} />
					</PageTitle>
					{activeTab === 'list' && !isLoading && (
						<div className="fixed bottom-28 right-2 z-[60] md:hidden">
							<Popover
								open={isCalendarOpen}
								onOpenChange={setIsCalendarOpen}
							>
								<PopoverTrigger asChild>
									<Button
										size="icon"
										className="rounded-full h-14 w-14 shadow-lg"
									>
										<CalendarIcon className="h-6 w-6" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="end"
								>
									<TransactionCalendar
										transactions={transactions}
										onDateSelect={handleDateSelect}
										month={currentDate}
										onMonthChange={setCurrentDate}
									/>
								</PopoverContent>
							</Popover>
						</div>
					)}
				</>
			}
		>
			<div className="overflow-y-auto">
				<div className="flex-1 flex flex-col relative">
					<div className="flex items-center justify-between my-6">
						<Button
							variant="ghost"
							size="icon"
							onClick={handlePrevMonth}
						>
							<BackArrow className="h-4 w-4" />
						</Button>
						<div className="font-semibold text-lg text-center">
							<span className="block">
								{DateTime.fromJSDate(currentDate)
									.setLocale(i18n.language)
									.toFormat('MMMM yyyy')}
							</span>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNextMonth}
						>
							<ForwardArrow className="h-4 w-4" />
						</Button>
					</div>
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full flex-1 flex flex-col h-full"
					>
						<TabsList className="grid w-full grid-cols-2 mb-6 shrink-0">
							<TabsTrigger value="list">{t('list')}</TabsTrigger>
							<TabsTrigger value="upcoming">
								{t('upcoming')}
							</TabsTrigger>
						</TabsList>
						<TabsContent
							value="list"
							className="flex-1 overflow-y-auto pb-24 relative"
						>
							{isLoading ? (
								<Loader />
							) : (
								<div className="flex gap-6">
									{/* Desktop only: fixed calendar sidebar */}
									<div className="hidden md:block shrink-0">
										<div className="sticky top-0 p-4 mx-2 rounded-xl border bg-card">
											<TransactionCalendar
												transactions={transactions}
												onDateSelect={handleDateSelect}
												month={currentDate}
												onMonthChange={setCurrentDate}
												className="[--cell-size:2.5rem] p-2"
											/>
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<TransactionList
											transactions={transactions}
											onCardClick={handleEditTransaction}
										/>
									</div>
								</div>
							)}
						</TabsContent>
						<TabsContent
							value="upcoming"
							className="flex-1 overflow-y-auto pb-24"
						>
							<UpcomingTransactions month={currentDate} />
						</TabsContent>
					</Tabs>
				</div>
				<TransactionForm
					open={isFormOpen}
					onOpenChange={setIsFormOpen}
					transactionToEdit={editingTransaction}
				/>
			</div>
		</PageDisplay>
	);
};

export default Transactions;
