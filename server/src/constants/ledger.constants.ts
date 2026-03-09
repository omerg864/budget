import { TransactionType } from '@shared/constants/transaction.constants';

export const defaultCategories = [
  {
    name: 'groceries',
    type: TransactionType.EXPENSE,
    color: '#ef4444',
  },
  {
    name: 'transport',
    type: TransactionType.EXPENSE,
    color: '#14b8a6',
  },
  {
    name: 'housing',
    type: TransactionType.EXPENSE,
    color: '#3b82f6',
  },
  {
    name: 'utilities',
    type: TransactionType.EXPENSE,
    color: '#f59e0b',
  },
  {
    name: 'entertainment',
    type: TransactionType.EXPENSE,
    color: '#a855f7',
  },
  {
    name: 'salary',
    type: TransactionType.INCOME,
    color: '#22c55e',
  },
];
