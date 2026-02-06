import { useRecurringTransactionsQuery } from '@/api/recurring-transaction.api';
import BillCard from '@/components/bill/BillCard';
import { BillForm } from '@/components/bill/BillForm.tsx';
import AddButton from '@/components/custom/AddButton.tsx';
import BackButton from '@/components/custom/BackButton.tsx';
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
						<BillCard bill={bill} handleEditBill={handleEditBill} />
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
