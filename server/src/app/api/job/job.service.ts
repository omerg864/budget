import { Injectable } from '@nestjs/common';
import { TransactionPaymentType } from '@shared/constants/transaction.constants';
import { getThisMonthChargeDates } from '@shared/services/transaction.shared-service';
import { AccountEntity } from '@shared/types/account.type';
import { CreditEntity } from '@shared/types/credit.type';
import { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type';
import { forEachLimit, parallel } from 'async';
import { groupBy, keyBy } from 'lodash';
import { AccountService } from '../account/account.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreditService } from '../credit/credit.service';
import { LedgerService } from '../ledger/ledger.service';
import { RecurringTransactionService } from '../recurringTransaction/recurringTransaction.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class JobService {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly accountService: AccountService,
    private readonly creditService: CreditService,
    private readonly recurringTransactionService: RecurringTransactionService,
    private readonly transactionService: TransactionService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  private getPaymentKey(rt: RecurringTransactionEntity) {
    return `${rt.paymentId}-${rt.paymentType}`;
  }

  private getPaymentFromCollections(
    rt: RecurringTransactionEntity,
    accounts: Record<AccountEntity['id'], AccountEntity>,
    credits: Record<CreditEntity['id'], CreditEntity>,
  ) {
    if (rt.paymentType === TransactionPaymentType.ACCOUNT) {
      return accounts[rt.paymentId];
    }
    return credits[rt.paymentId];
  }

  async createRecurringTransactionsOfToday() {
    const recurringTransactions =
      await this.recurringTransactionService.findAll();

    const filteredRecurringTransactions = recurringTransactions.filter((rt) => {
      const chargeDates = getThisMonthChargeDates(rt, new Date());
      return (
        chargeDates.filter((date) => date.getDate() === new Date().getDate())
          .length > 0
      );
    });

    if (filteredRecurringTransactions.length === 0) {
      return;
    }

    const accountIds = new Set<string>();
    const creditIds = new Set<string>();
    filteredRecurringTransactions.forEach((rt) => {
      if (rt.paymentType === TransactionPaymentType.ACCOUNT) {
        accountIds.add(rt.paymentId);
      } else {
        creditIds.add(rt.paymentId);
      }
    });
    const { accounts, credits } = await parallel<
      void,
      { accounts: AccountEntity[]; credits: CreditEntity[] }
    >({
      accounts: async () =>
        this.accountService.findByIds(Array.from(accountIds)),
      credits: async () => this.creditService.findByIds(Array.from(creditIds)),
    });
    const keyedAccounts = keyBy(accounts, (a) => a.id);
    const keyedCredits = keyBy(credits, (c) => c.id);
    const recurringTransactionByPayment = groupBy(
      filteredRecurringTransactions,
      (rt) => this.getPaymentKey(rt),
    );
    await forEachLimit(
      Object.values(recurringTransactionByPayment),
      10,
      async (paymentTransactions) => {
        for (const rt of paymentTransactions) {
          const payment = this.getPaymentFromCollections(
            rt,
            keyedAccounts,
            keyedCredits,
          );
          if (!payment) {
            continue;
          }
          await this.transactionService.create(
            this.recurringTransactionService.createTransactionEntity(
              new Date(),
              rt,
            ),
            payment,
          );
        }
      },
    );
  }

  async chargeCreditsOfMonth() {
    const credits = await this.creditService.findAll();
    if (credits.length === 0) {
      return;
    }
    const accountIds = new Set<string>();
    credits.forEach((credit) => {
      accountIds.add(credit.accountId);
    });
    const accounts = await this.accountService.findByIds(
      Array.from(accountIds),
    );
    const keyedAccounts = keyBy(accounts, (a) => a.id);
    const groupedCreditsByAccount = groupBy(credits, (c) => c.accountId);
    await forEachLimit(
      Object.values(groupedCreditsByAccount),
      10,
      async (credits) => {
        const account = keyedAccounts[credits[0].accountId];
        if (!account) {
          return;
        }
        const amount = credits.reduce((acc, credit) => acc + credit.amount, 0);
        if (amount === 0) {
          return;
        }
        await parallel([
          async () =>
            this.accountService.updateBalance(account.id, 'increment', amount),
          async () =>
            this.creditService.updateByAccountId(account.id, {
              amount: 0,
            }),
        ]);
      },
    );
  }

  async calculateAllMonthlyAnalytics(month: Date) {
    const ledgers = await this.ledgerService.findAll();
    for (const ledger of ledgers) {
      await this.analyticsService.calculateMonthlyAnalytics(ledger.id, month);
    }
  }

  async calculateAllYearlyAnalytics(year: number) {
    const ledgers = await this.ledgerService.findAll();
    for (const ledger of ledgers) {
      await this.analyticsService.calculateYearlyAnalytics(ledger.id, year);
    }
  }
}
