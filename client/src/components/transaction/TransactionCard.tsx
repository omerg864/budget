import { useLedgerQuery } from '@/api/ledger.api.ts';
import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import { TransactionType } from '@shared/constants/transaction.constants.ts';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { useMemo, type FC } from 'react';
import CategoryNameFormatter from '../formatters/CategoryNameFormatter.tsx';
import CurrencyFormatter from '../formatters/CurrencyFormatter.tsx';
import CategoryIcon from '../ledger/CategoryIcon.tsx';

interface TransactionCardProps {
	transaction: TransactionEntity;
	onCardClick: (transaction: TransactionEntity) => void;
}

const TransactionCard: FC<TransactionCardProps> = ({
	transaction,
	onCardClick,
}) => {
	const isExpense = transaction.type === TransactionType.EXPENSE;
	const amountColor = isExpense ? 'text-red-500' : 'text-green-500';
	const { ledgerId } = usePreferencesStore();
	const { data: ledger } = useLedgerQuery(ledgerId || '');
	const category = useMemo(
		() => ledger?.categories.find((c) => c.id === transaction.category),
		[ledger, transaction],
	);

	return (
		<div
			onClick={() => onCardClick(transaction)}
			className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-transform active:scale-[0.98] dark:bg-slate-900"
		>
			<div className="flex items-center gap-4">
				<CategoryIcon category={category} />
				<div>
					<h3 className="font-semibold text-gray-900">
						{transaction.description}
					</h3>
					<p className="text-sm text-gray-500">
						<CategoryNameFormatter value={category?.name} />
					</p>
				</div>
			</div>
			<div className={cn('font-bold text-lg text-nowrap', amountColor)}>
				<CurrencyFormatter
					amount={transaction.amount * (isExpense ? -1 : 1)}
					currency={transaction.currency}
					signDisplay="always"
				/>
			</div>
		</div>
	);
};

export default TransactionCard;
