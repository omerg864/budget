import { SupportedCurrencies } from '../constants/currency.constants';
import type { AccountEntity } from './account.type';
import type { CreditEntity } from './credit.type';
import type { LedgerCategory, LedgerUser } from './ledger.type';

export type MonthlyAnalyticEntity = {
	ledgerId: string;
	month: Date | string;
	currency: SupportedCurrencies;
	totalAssets: number;
	totalIncome: number;
	totalExpense: number;
	totalBalance: number;
	categories: LedgerCategory[];
	users: LedgerUser[];
	totalIncomeByUser: Record<LedgerUser['id'], number>;
	totalExpenseByUser: Record<LedgerUser['id'], number>;
	totalIncomeByCategory: Record<LedgerCategory['id'], number>;
	totalExpenseByCategory: Record<LedgerCategory['id'], number>;
	totalByAccount: Record<AccountEntity['id'], number>;
	totalByCredit: Record<CreditEntity['id'], number>;
};

export type YearlyAnalyticEntity = {
	ledgerId: string;
	year: number;
	currency: SupportedCurrencies;
	totalAssets: number;
	totalIncome: number;
	totalExpense: number;
	totalBalance: number;
	categories: LedgerCategory[];
	users: LedgerUser[];
	totalIncomeByUser: Record<LedgerUser['id'], number>;
	totalExpenseByUser: Record<LedgerUser['id'], number>;
	totalIncomeByCategory: Record<LedgerCategory['id'], number>;
	totalExpenseByCategory: Record<LedgerCategory['id'], number>;
	totalByAccount: Record<AccountEntity['id'], number>;
	totalByCredit: Record<CreditEntity['id'], number>;
};
