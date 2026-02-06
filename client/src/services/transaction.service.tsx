import { TransactionType } from '@shared/constants/transaction.constants';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';

export function getTransactionTypeIcon(type: TransactionType): ReactNode {
	switch (type) {
		case TransactionType.EXPENSE:
			return <TrendingDown className="h-4 w-4 text-red-500" />;
		case TransactionType.INCOME:
			return <TrendingUp className="h-4 w-4 text-green-500" />;
		default:
			return null;
	}
}
