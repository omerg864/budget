import { useLedgerQuery } from '@/api/ledger.api';
import InlineDotList from '@/components/custom/InlineDotList';
import CategoryIcon from '@/components/ledger/CategoryIcon';
import { usePreferencesStore } from '@/stores/usePreferences';
import { TransactionType } from '@shared/constants/transaction.constants';
import type { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type';
import { useMemo, type FC } from 'react';
import CategoryNameFormatter from '../formatters/CategoryNameFormatter.tsx';
import CurrencyFormatter from '../formatters/CurrencyFormatter';
import TransactionRecurringFrequencyFormatter from '../formatters/TransactionRecurringFrequencyFormatter';

export type BillCardProps = {
	bill: RecurringTransactionEntity;
	handleEditBill: (bill: RecurringTransactionEntity) => void;
};

const BillCard: FC<BillCardProps> = ({
	bill,
	handleEditBill,
}: BillCardProps) => {
	const { ledgerId } = usePreferencesStore();
	const { data: ledger } = useLedgerQuery(ledgerId || '');

	const category = useMemo(
		() => ledger?.categories.find((c) => c.id === bill.category),
		[ledger, bill],
	);

	const isExpense = bill.type === TransactionType.EXPENSE;
	const amountColor = isExpense ? 'text-red-500' : 'text-green-500';

	return (
		<div
			className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-[0.98]"
			onClick={() => handleEditBill(bill)}
		>
			<div className="flex items-center gap-4">
				<CategoryIcon category={category} />
				<div>
					<h3 className="font-semibold text-gray-900 dark:text-gray-100">
						{bill.description}
					</h3>
					<div className="text-sm text-gray-500">
						<InlineDotList
							items={[
								<CategoryNameFormatter
									value={category?.name}
								/>,
								<TransactionRecurringFrequencyFormatter
									key="frequency"
									value={bill.frequency}
								/>,
							]}
						/>
					</div>
				</div>
			</div>
			<div className={`font-bold text-lg ${amountColor}`}>
				<CurrencyFormatter
					amount={bill.amount * (isExpense ? -1 : 1)}
					currency={bill.currency}
					signDisplay="always"
				/>
			</div>
		</div>
	);
};

export default BillCard;
