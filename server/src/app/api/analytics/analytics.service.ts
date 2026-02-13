import { Injectable } from '@nestjs/common';
import {
  LedgerAccessRole,
  SupportedIcons,
} from '@shared/constants/ledger.constants';
import {
  TransactionPaymentType,
  TransactionType,
} from '@shared/constants/transaction.constants';
import { convertCurrency } from '@shared/services/transaction.shared-service';
import {
  MonthlyAnalyticEntity,
  YearlyAnalyticEntity,
} from '@shared/types/analytic.type';
import { LedgerEntity, LedgerUser } from '@shared/types/ledger.type';
import { TransactionEntity } from '@shared/types/transaction.type';
import { aggregateTransactionsToAnalytic } from '@shared/utils/analytics.utils';
import { DateTime } from 'luxon';
import { CurrencyService } from '../../modules/currency/currency.service';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { AccountService } from '../account/account.service';
import { LedgerProvider } from '../ledger/ledger.provider';
import { TransactionProvider } from '../transaction/transaction.provider';
import { UserService } from '../user/user.service';
import { MonthlyAnalyticProvider } from './monthly-analytic.provider';
import { YearlyAnalyticProvider } from './yearly-analytic.provider';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly transactionProvider: TransactionProvider,
    private readonly ledgerProvider: LedgerProvider,
    private readonly monthlyAnalyticProvider: MonthlyAnalyticProvider,
    private readonly yearlyAnalyticProvider: YearlyAnalyticProvider,
    private readonly currencyService: CurrencyService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly ledgerAccessService: LedgerAccessService,
  ) {}

  private getStartAndEndOfMonth(date: Date) {
    const luxonDate = DateTime.fromJSDate(date);
    const start = luxonDate.startOf('month').toJSDate();
    const end = luxonDate.endOf('month').toJSDate();
    return { start, end };
  }

  private async getLedgerUser(
    userId: string,
    ledgerId: string,
  ): Promise<LedgerUser | null> {
    const user = await this.userService.findOne(userId);
    if (!user) return null;

    const access = await this.ledgerAccessService.findByLedgerIdAndUserId(
      ledgerId,
      userId,
    );
    const role = access?.role ?? LedgerAccessRole.READ_ONLY; // Default/Fallback

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    };
  }

  async getTotalAssets(ledgerId: string) {
    const accounts = await this.accountService.findByLedgerId(ledgerId);
    const ledger = await this.ledgerProvider.findOne(ledgerId);
    if (!ledger) {
      throw new Error(`Ledger not found: ${ledgerId}`);
    }

    return accounts.reduce(async (accPromise, account) => {
      const acc = await accPromise;
      let amount = account.balance;
      if (account.currency !== ledger.currency) {
        const rate = await this.currencyService.getExchangeRate(
          account.currency,
          ledger.currency,
        );
        amount = convertCurrency(amount, rate);
      }
      return acc + amount;
    }, Promise.resolve(0));
  }

  async getMonthlyAnalytics(ledgerId: string, start: Date, end: Date) {
    return this.monthlyAnalyticProvider.findByLedgerIdAndDateRange(
      ledgerId,
      start,
      end,
    );
  }

  async getYearlyAnalytics(ledgerId: string, start: number, end: number) {
    return this.yearlyAnalyticProvider.findByLedgerIdAndDateRange(
      ledgerId,
      start,
      end,
    );
  }

  async calculateMonthlyAnalytics(ledgerId: string, month: Date) {
    const { start, end } = this.getStartAndEndOfMonth(month);
    const transactions = await this.transactionProvider.findByLedgerId(
      ledgerId,
      start,
      end,
    );

    const ledger = await this.ledgerProvider.findOne(ledgerId);
    if (!ledger) {
      throw new Error(`Ledger not found: ${ledgerId}`);
    }

    const totalAssets = await this.getTotalAssets(ledgerId);
    const ledgerUsers: LedgerUser[] = [];
    const transactionUserIds = new Set(
      transactions.map((t) => t.userId).filter((id): id is string => !!id),
    );

    for (const userId of transactionUserIds) {
      const user = await this.getLedgerUser(userId, ledgerId);
      if (user) {
        ledgerUsers.push(user);
      }
    }

    // Pre-process transactions for currency conversion if needed
    const processedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        if (transaction.currency !== ledger.currency) {
          const rate = await this.currencyService.getExchangeRate(
            transaction.currency,
            ledger.currency,
          );
          const convertedAmount = convertCurrency(transaction.amount, rate);
          return {
            ...transaction,
            convertedAmount,
            convertedCurrency: ledger.currency,
          };
        }
        return transaction;
      }),
    );

    const analytic = aggregateTransactionsToAnalytic(
      processedTransactions,
      ledger,
      start,
      ledgerUsers,
    );

    analytic.totalAssets = totalAssets;

    await this.monthlyAnalyticProvider.update(ledgerId, start, analytic);
    return analytic;
  }

  async calculateYearlyAnalytics(ledgerId: string, year: number) {
    const startOfYear = DateTime.fromObject({ year })
      .startOf('year')
      .toJSDate();
    const endOfYear = DateTime.fromObject({ year }).endOf('year').toJSDate();
    const ledger = await this.ledgerProvider.findOne(ledgerId);
    if (!ledger) {
      throw new Error(`Ledger not found: ${ledgerId}`);
    }

    const monthlyAnalytics =
      await this.monthlyAnalyticProvider.findByLedgerIdAndDateRange(
        ledgerId,
        startOfYear,
        endOfYear,
      );

    const totalAssets = await this.getTotalAssets(ledgerId);

    const initialAnalytic: YearlyAnalyticEntity = {
      ledgerId,
      year,
      currency: ledger.currency,
      totalAssets,
      totalIncome: 0,
      totalExpense: 0,
      totalBalance: 0,
      totalIncomeByCategory: {},
      totalExpenseByCategory: {},
      categories: [],
      users: [],
      totalIncomeByUser: {},
      totalExpenseByUser: {},
      totalByAccount: {},
      totalByCredit: {},
    };

    const analytic = monthlyAnalytics.reduce((acc, month) => {
      const scale = 1; // Assuming monthly analytics are already in ledger currency

      acc.totalIncome += month.totalIncome * scale;
      acc.totalExpense += month.totalExpense * scale;
      acc.totalBalance += month.totalBalance * scale;

      // Merge categories
      month.categories.forEach((cat) => {
        if (!acc.categories.some((c) => c.id === cat.id)) {
          acc.categories.push(cat);
        }
      });

      // Merge users
      month.users.forEach((user) => {
        if (!acc.users.some((u) => u.id === user.id)) {
          acc.users.push(user);
        }
      });

      // Aggregate Maps
      const aggregateMap = (
        target: Record<string, number>,
        source: Record<string, number>,
      ) => {
        for (const [key, value] of Object.entries(source || {})) {
          target[key] = (target[key] || 0) + value * scale;
        }
      };

      aggregateMap(acc.totalIncomeByCategory, month.totalIncomeByCategory);
      aggregateMap(acc.totalExpenseByCategory, month.totalExpenseByCategory);
      aggregateMap(acc.totalIncomeByUser, month.totalIncomeByUser);
      aggregateMap(acc.totalExpenseByUser, month.totalExpenseByUser);
      aggregateMap(acc.totalByAccount, month.totalByAccount);
      aggregateMap(acc.totalByCredit, month.totalByCredit);

      return acc;
    }, initialAnalytic);

    await this.yearlyAnalyticProvider.update(ledgerId, year, analytic);
    return analytic;
  }

  private async updateMonthlyAnalytic(
    transaction: TransactionEntity,
    ledger: LedgerEntity,
    isAddition: boolean,
  ) {
    const date = DateTime.fromJSDate(transaction.date);
    const { start } = this.getStartAndEndOfMonth(date.toJSDate());
    const now = DateTime.now();

    // If transaction date is in current month or future, do not update analytic
    if (date.startOf('month') >= now.startOf('month')) {
      return;
    }

    let analytic = await this.monthlyAnalyticProvider.findByLedgerIdAndMonth(
      ledger.id,
      start,
    );

    if (!analytic) {
      // Create initial if not exists
      const totalAssets = await this.getTotalAssets(ledger.id);
      const initial: MonthlyAnalyticEntity = {
        ledgerId: ledger.id,
        month: start,
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
      analytic = await this.monthlyAnalyticProvider.create(initial);
    }

    // Ensure nested objects exist (migration safety)
    if (!analytic.totalIncomeByUser) analytic.totalIncomeByUser = {};
    if (!analytic.totalExpenseByUser) analytic.totalExpenseByUser = {};
    if (!analytic.users) analytic.users = [];
    if (!analytic.totalIncomeByCategory) analytic.totalIncomeByCategory = {};
    if (!analytic.totalExpenseByCategory) analytic.totalExpenseByCategory = {};

    let amount = transaction.amount;
    if (transaction.currency !== ledger.currency) {
      const rate = await this.currencyService.getExchangeRate(
        transaction.currency,
        analytic.currency,
      );
      amount = convertCurrency(amount, rate);
    }

    const modifier = isAddition ? 1 : -1;
    const finalAmount = amount * modifier;

    const isExpense = transaction.type === TransactionType.EXPENSE;
    const isIncome = transaction.type === TransactionType.INCOME;

    if (isExpense) {
      analytic.totalExpense = (analytic.totalExpense || 0) + finalAmount;
      analytic.totalBalance = (analytic.totalBalance || 0) - finalAmount;
      analytic.totalAssets = (analytic.totalAssets || 0) - finalAmount;

      if (transaction.userId) {
        analytic.totalExpenseByUser[transaction.userId] =
          (analytic.totalExpenseByUser[transaction.userId] || 0) + finalAmount;
      }

      if (transaction.category) {
        const categoryId = transaction.category ?? 'Other';
        const currentCat = analytic.totalExpenseByCategory[categoryId] || 0;
        analytic.totalExpenseByCategory[categoryId] = currentCat + finalAmount;
      }
    } else if (isIncome) {
      analytic.totalIncome = (analytic.totalIncome || 0) + finalAmount;
      analytic.totalBalance = (analytic.totalBalance || 0) + finalAmount;
      analytic.totalAssets = (analytic.totalAssets || 0) + finalAmount;

      if (transaction.userId) {
        analytic.totalIncomeByUser[transaction.userId] =
          (analytic.totalIncomeByUser[transaction.userId] || 0) + finalAmount;
      }

      if (transaction.category) {
        const categoryId = transaction.category ?? 'Other';
        const currentCat = analytic.totalIncomeByCategory[categoryId] || 0;
        analytic.totalIncomeByCategory[categoryId] = currentCat + finalAmount;
      }
    }

    if (
      transaction.userId &&
      !analytic.users.some((u) => u.id === transaction.userId)
    ) {
      const ledgerUser = await this.getLedgerUser(
        transaction.userId,
        ledger.id,
      );
      if (ledgerUser) {
        analytic.users.push(ledgerUser);
      }
    }

    if (transaction.category) {
      const categoryId = transaction.category ?? 'Other';
      if (!analytic.categories.some((c) => c.id === categoryId)) {
        const category = ledger.categories.find((c) => c.id === categoryId);
        if (category) {
          analytic.categories.push(category);
        } else {
          analytic.categories.push({
            id: categoryId,
            name: 'Other',
            type: transaction.type,
            icon: SupportedIcons.Other,
            color: '#000000',
          });
        }
      }
    }

    if (transaction.paymentId) {
      if (transaction.paymentType === TransactionPaymentType.ACCOUNT) {
        const currentAcc = analytic.totalByAccount[transaction.paymentId] || 0;
        analytic.totalByAccount[transaction.paymentId] =
          currentAcc + finalAmount;
      } else {
        const currentCred = analytic.totalByCredit[transaction.paymentId] || 0;
        analytic.totalByCredit[transaction.paymentId] =
          currentCred + finalAmount;
      }
    }

    await this.monthlyAnalyticProvider.update(ledger.id, start, analytic);
  }

  private async updateYearlyAnalytic(
    transaction: TransactionEntity,
    ledger: LedgerEntity,
    isAddition: boolean,
  ) {
    const date = DateTime.fromJSDate(transaction.date);
    const year = date.year;

    let analytic = await this.yearlyAnalyticProvider.findByLedgerIdAndYear(
      ledger.id,
      year,
    );

    if (!analytic) {
      const totalAssets = await this.getTotalAssets(ledger.id);
      const initial: YearlyAnalyticEntity = {
        ledgerId: ledger.id,
        year: year,
        currency: ledger.currency,
        totalAssets,
        totalIncome: 0,
        totalExpense: 0,
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
      analytic = await this.yearlyAnalyticProvider.create(initial);
    } else if (!analytic.currency) {
      analytic.currency = ledger.currency;
    }

    // Ensure nested objects exist
    if (!analytic.totalIncomeByUser) analytic.totalIncomeByUser = {};
    if (!analytic.totalExpenseByUser) analytic.totalExpenseByUser = {};
    if (!analytic.users) analytic.users = [];
    if (!analytic.totalIncomeByCategory) analytic.totalIncomeByCategory = {};
    if (!analytic.totalExpenseByCategory) analytic.totalExpenseByCategory = {};

    let amount = transaction.amount;
    if (transaction.currency !== ledger.currency) {
      const rate = await this.currencyService.getExchangeRate(
        transaction.currency,
        ledger.currency,
      );
      amount = convertCurrency(amount, rate);
    }

    const modifier = isAddition ? 1 : -1;
    const finalAmount = amount * modifier;

    const isExpense = transaction.type === TransactionType.EXPENSE;
    const isIncome = transaction.type === TransactionType.INCOME;

    if (isExpense) {
      analytic.totalExpense = (analytic.totalExpense || 0) + finalAmount;
      analytic.totalBalance = (analytic.totalBalance || 0) - finalAmount;
      analytic.totalAssets = (analytic.totalAssets || 0) - finalAmount;

      if (transaction.userId) {
        analytic.totalExpenseByUser[transaction.userId] =
          (analytic.totalExpenseByUser[transaction.userId] || 0) + finalAmount;
      }

      if (transaction.category) {
        const categoryId = transaction.category ?? 'Other';
        const currentCat = analytic.totalExpenseByCategory[categoryId] || 0;
        analytic.totalExpenseByCategory[categoryId] = currentCat + finalAmount;
      }
    } else if (isIncome) {
      analytic.totalIncome = (analytic.totalIncome || 0) + finalAmount;
      analytic.totalBalance = (analytic.totalBalance || 0) + finalAmount;
      analytic.totalAssets = (analytic.totalAssets || 0) + finalAmount;

      if (transaction.userId) {
        analytic.totalIncomeByUser[transaction.userId] =
          (analytic.totalIncomeByUser[transaction.userId] || 0) + finalAmount;
      }

      if (transaction.category) {
        const categoryId = transaction.category ?? 'Other';
        const currentCat = analytic.totalIncomeByCategory[categoryId] || 0;
        analytic.totalIncomeByCategory[categoryId] = currentCat + finalAmount;
      }
    }

    if (
      transaction.userId &&
      !analytic.users.some((u) => u.id === transaction.userId)
    ) {
      const ledgerUser = await this.getLedgerUser(
        transaction.userId,
        ledger.id,
      );
      if (ledgerUser) {
        analytic.users.push(ledgerUser);
      }
    }

    if (transaction.category) {
      const categoryId = transaction.category ?? 'Other';
      if (!analytic.categories.some((c) => c.id === categoryId)) {
        const category = ledger.categories.find((c) => c.id === categoryId);
        if (category) {
          analytic.categories.push(category);
        } else {
          analytic.categories.push({
            id: categoryId,
            name: 'Other',
            type: transaction.type,
            icon: SupportedIcons.Other,
            color: '#000000',
          });
        }
      }
    }

    if (transaction.paymentId) {
      if (transaction.paymentType === TransactionPaymentType.ACCOUNT) {
        const currentAcc = analytic.totalByAccount[transaction.paymentId] || 0;
        analytic.totalByAccount[transaction.paymentId] =
          currentAcc + finalAmount;
      } else {
        const currentCred = analytic.totalByCredit[transaction.paymentId] || 0;
        analytic.totalByCredit[transaction.paymentId] =
          currentCred + finalAmount;
      }
    }

    await this.yearlyAnalyticProvider.update(ledger.id, year, analytic);
  }

  async updateAnalyticsForTransaction(
    operation: 'create' | 'update' | 'delete',
    currentTransaction?: TransactionEntity,
    newTransaction?: TransactionEntity,
  ) {
    const transaction = newTransaction || currentTransaction;
    if (!transaction) return;

    const ledger = await this.ledgerProvider.findOne(transaction.ledgerId);
    if (!ledger) return;

    if (operation === 'create' && newTransaction) {
      await this.updateMonthlyAnalytic(newTransaction, ledger, true);
      await this.updateYearlyAnalytic(newTransaction, ledger, true);
    } else if (operation === 'delete' && currentTransaction) {
      await this.updateMonthlyAnalytic(currentTransaction, ledger, false);
      await this.updateYearlyAnalytic(currentTransaction, ledger, false);
    } else if (operation === 'update' && currentTransaction && newTransaction) {
      // Remove old
      await this.updateMonthlyAnalytic(currentTransaction, ledger, false);
      await this.updateYearlyAnalytic(currentTransaction, ledger, false);
      // Add new
      await this.updateMonthlyAnalytic(newTransaction, ledger, true);
      await this.updateYearlyAnalytic(newTransaction, ledger, true);
    }
  }
}
