import { getTransactionTypeIcon } from '@/services/transaction.service';
import { TransactionType } from '@shared/constants/transaction.constants';
import type { FC } from 'react';
import TransactionTypeFormatter from '../formatters/TransactionTypeFormatter';
import { TabsList, TabsTrigger } from '../ui/tabs';

export type TransactionTypeTabsProps = {
	onChange: (type: TransactionType) => void;
	defaultValue?: TransactionType;
};

const TransactionTypeTabs: FC<TransactionTypeTabsProps> = ({
	onChange,
	defaultValue,
}: TransactionTypeTabsProps) => {
	return (
		<TabsList className="w-full" defaultValue={defaultValue}>
			<TabsTrigger
				value={TransactionType.EXPENSE}
				onClick={() => onChange(TransactionType.EXPENSE)}
			>
				{getTransactionTypeIcon(TransactionType.EXPENSE)}
				<TransactionTypeFormatter value={TransactionType.EXPENSE} />
			</TabsTrigger>
			<TabsTrigger
				value={TransactionType.INCOME}
				onClick={() => onChange(TransactionType.INCOME)}
			>
				{getTransactionTypeIcon(TransactionType.INCOME)}
				<TransactionTypeFormatter value={TransactionType.INCOME} />
			</TabsTrigger>
		</TabsList>
	);
};

export default TransactionTypeTabs;
