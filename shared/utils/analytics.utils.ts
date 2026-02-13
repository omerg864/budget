import {
	TransactionPaymentType,
	TransactionType,
} from '../constants/transaction.constants';
import type { MonthlyAnalyticEntity } from '../types/analytic.type';
import type { LedgerEntity, LedgerUser } from '../types/ledger.type';
import type { TransactionEntity } from '../types/transaction.type';

import type { AccountEntity } from '../types/account.type';

export const aggregateTransactionsToAnalytic = (
	transactions: TransactionEntity[],
	ledger: LedgerEntity,
	monthDate: Date,
	ledgerUsers: LedgerUser[] = [],
	accounts: AccountEntity[] = [],
	exchangeRates: Record<string, number> = {},
): MonthlyAnalyticEntity => {
	const totalAssets = accounts.reduce((sum, account) => {
		let balance = account.balance;
		if (account.currency !== ledger.currency) {
			const rate = exchangeRates[account.currency];
			if (rate) {
				balance *= rate;
			}
		}
		return sum + balance;
	}, 0);

	const initial: MonthlyAnalyticEntity = {
		ledgerId: ledger.id,
		month: monthDate,
		currency: ledger.currency,
		totalIncome: 0,
		totalExpense: 0,
		totalAssets,
		totalBalance: 0,
		totalIncomeByCategory: {},
		totalExpenseByCategory: {},
		totalByAccount: {},
		totalByCredit: {},
		categories: [],
		users: [],
		totalIncomeByUser: {},
		totalExpenseByUser: {},
	};

	return transactions.reduce((acc, transaction) => {
		const amount = transaction.amount;

		const finalAmount =
			transaction.currency === ledger.currency
				? amount
				: transaction.convertedAmount || amount;

		const isExpense = transaction.type === TransactionType.EXPENSE;
		const isIncome = transaction.type === TransactionType.INCOME;

		if (isExpense) {
			acc.totalExpense += finalAmount;
			acc.totalBalance -= finalAmount;
		} else if (isIncome) {
			acc.totalIncome += finalAmount;
			acc.totalBalance += finalAmount;
		}

		// User aggregation
		if (transaction.userId) {
			if (isIncome) {
				acc.totalIncomeByUser[transaction.userId] =
					(acc.totalIncomeByUser[transaction.userId] || 0) +
					finalAmount;
			} else if (isExpense) {
				acc.totalExpenseByUser[transaction.userId] =
					(acc.totalExpenseByUser[transaction.userId] || 0) +
					finalAmount;
			}

			if (!acc.users.some((u) => u.id === transaction.userId)) {
				const user = ledgerUsers.find(
					(u) => u.id === transaction.userId,
				);
				if (user) {
					acc.users.push(user);
				}
			}
		}

		// Category aggregation
		if (transaction.category) {
			const categoryId = transaction.category;

			if (isIncome) {
				acc.totalIncomeByCategory[categoryId] =
					(acc.totalIncomeByCategory[categoryId] || 0) + finalAmount;
			} else if (isExpense) {
				acc.totalExpenseByCategory[categoryId] =
					(acc.totalExpenseByCategory[categoryId] || 0) + finalAmount;
			}

			const category = ledger.categories.find((c) => c.id === categoryId);
			if (category && !acc.categories.some((c) => c.id === category.id)) {
				acc.categories.push(category);
			} else if (
				!category &&
				!acc.categories.some((c) => c.id === 'Other')
			) {
				// Handle unknown category
			}
		}

		// Payment method aggregation
		if (transaction.paymentId) {
			if (transaction.paymentType === TransactionPaymentType.ACCOUNT) {
				acc.totalByAccount[transaction.paymentId] =
					(acc.totalByAccount[transaction.paymentId] || 0) +
					finalAmount;
			} else {
				acc.totalByCredit[transaction.paymentId] =
					(acc.totalByCredit[transaction.paymentId] || 0) +
					finalAmount;
			}
		}

		return acc;
	}, initial);
};
