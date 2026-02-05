import { useRecurringTransactionsQuery } from '@/api/recurring-transaction.api';
import { BillForm } from '@/components/bill/BillForm.tsx';
import AddButton from '@/components/custom/AddButton.tsx';
import BackButton from '@/components/custom/BackButton.tsx';
import CurrencyFormatter from '@/components/formatters/CurrencyFormatter.tsx';
import PageDisplay from '@/components/layout/PageDisplay.tsx';
import PageTitle from '@/components/layout/PageTitle';
import { usePreferencesStore } from '@/stores/usePreferences';
import type { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type.ts';
import { useMemoizedFn } from 'ahooks';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const Bills: FC = () => {
	const { t } = useTranslation('bills');
	const navigate = useNavigate();
	const { ledgerId } = usePreferencesStore();
	const { data: bills = [], isLoading } = useRecurringTransactionsQuery(
		ledgerId || '',
	);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [billToEdit, setBillToEdit] =
		useState<RecurringTransactionEntity | null>(null);

	const handleCreateBill = useMemoizedFn(() => {
		setBillToEdit(null);
		setIsFormOpen(true);
	});

	const handleEditBill = useMemoizedFn((bill: RecurringTransactionEntity) => {
		setBillToEdit(bill);
		setIsFormOpen(true);
	});

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<PageDisplay
				isLoading={isLoading}
				fixed={
					<div className="shrink-0 mb-4">
						<PageTitle
							title={
								<div className="flex items-center gap-2">
									<BackButton onClick={() => navigate(-1)} />
									<h1 className="text-2xl font-bold">
										{t('title')}
									</h1>
								</div>
							}
						>
							<AddButton onAdd={handleCreateBill} />
						</PageTitle>
					</div>
				}
			>
				<div className="space-y-4 overflow-y-auto pb-4 px-1 -mx-1">
					{bills.map((bill) => (
						<div
							key={bill.id}
							className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
							onClick={() => handleEditBill(bill)}
						>
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-gray-100">
									{bill.description}
								</h3>
								<p className="text-sm text-gray-500">
									{bill.frequency}
								</p>
							</div>
							<div className="font-bold text-lg">
								<CurrencyFormatter
									amount={bill.amount}
									currency={bill.currency}
									signDisplay="always"
								/>
							</div>
						</div>
					))}
					{bills.length === 0 && !isLoading && (
						<div className="text-center text-gray-500 py-10">
							{t('noBillsFound')}
						</div>
					)}
				</div>
			</PageDisplay>

			<BillForm
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				billToEdit={billToEdit}
			/>
		</div>
	);
};

export default Bills;
