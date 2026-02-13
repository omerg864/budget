import { Test, TestingModule } from '@nestjs/testing';
import { CreditType } from '@shared/constants/credit.constants';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import {
  TransactionPaymentType,
  TransactionType,
} from '@shared/constants/transaction.constants';
import { DateTime } from 'luxon';
import { AccountService } from '../../api/account/account.service';
import { CreditService } from '../../api/credit/credit.service';
import { CurrencyService } from '../currency/currency.service';
import { AppI18nService } from '../i18n/app-i18n.service';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let creditService: CreditService;
  let accountService: AccountService;
  // let currencyService: CurrencyService;

  const mockCreditService = {
    updateAmount: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAccountService = {
    updateBalance: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCurrencyService = {
    getExchangeRate: jest.fn().mockResolvedValue(1),
  };

  const mockI18nService = {
    t: jest.fn((key) => key),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: CreditService, useValue: mockCreditService },
        { provide: AccountService, useValue: mockAccountService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: AppI18nService, useValue: mockI18nService },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    creditService = module.get<CreditService>(CreditService);
    accountService = module.get<AccountService>(AccountService);
    // currencyService = module.get<CurrencyService>(CurrencyService);

    jest.clearAllMocks();
  });

  const mockCredit = {
    id: 'credit1',
    accountId: 'account1',
    type: CreditType.CREDIT,
  } as any;

  const mockAccount = {
    id: 'account1',
    currency: SupportedCurrencies.USD,
  } as any;

  const baseTransaction = {
    id: 'tx1',
    amount: 100,
    currency: SupportedCurrencies.USD,
    type: TransactionType.EXPENSE,
    paymentId: 'credit1',
    paymentType: TransactionPaymentType.CREDIT,
  } as any;

  describe('handleCreditPaymentUpdate', () => {
    it('should do nothing if transaction is in a future month', async () => {
      const futureDate = DateTime.now().plus({ months: 1 }).toJSDate();
      const transaction = { ...baseTransaction, date: futureDate };

      mockAccountService.findOne.mockResolvedValue(mockAccount);

      await service.handleCreditPaymentUpdate(mockCredit, transaction);

      expect(accountService.updateBalance).not.toHaveBeenCalled();
      expect(creditService.updateAmount).not.toHaveBeenCalled();
    });

    it('should update connected account if transaction is in a past month', async () => {
      const pastDate = DateTime.now().minus({ months: 1 }).toJSDate();
      const transaction = { ...baseTransaction, date: pastDate };

      mockAccountService.findOne.mockResolvedValue(mockAccount);
      mockAccountService.updateBalance.mockResolvedValue(mockAccount);

      await service.handleCreditPaymentUpdate(mockCredit, transaction);

      // Expense -> decrement
      expect(accountService.updateBalance).toHaveBeenCalledWith(
        'account1',
        'decrement',
        100,
      );
      expect(creditService.updateAmount).not.toHaveBeenCalled();
    });

    it('should update credit if transaction is in the current month', async () => {
      const currentDate = DateTime.now().toJSDate();
      const transaction = { ...baseTransaction, date: currentDate };

      mockAccountService.findOne.mockResolvedValue(mockAccount);
      mockCreditService.updateAmount.mockResolvedValue(mockCredit);

      await service.handleCreditPaymentUpdate(mockCredit, transaction);

      expect(creditService.updateAmount).toHaveBeenCalledWith(
        'credit1',
        'decrement',
        100,
      );
      expect(accountService.updateBalance).not.toHaveBeenCalled();
    });
  });

  describe('handleCreditPaymentUpdateForDeleteTransaction', () => {
    it('should do nothing if transaction is in a future month', async () => {
      const futureDate = DateTime.now().plus({ months: 1 }).toJSDate();
      const transaction = { ...baseTransaction, date: futureDate };

      mockAccountService.findOne.mockResolvedValue(mockAccount);

      await service.handleCreditPaymentUpdateForDeleteTransaction(
        mockCredit,
        transaction,
      );

      expect(accountService.updateBalance).not.toHaveBeenCalled();
      expect(creditService.updateAmount).not.toHaveBeenCalled();
    });

    it('should revert update on connected account if transaction is in a past month', async () => {
      const pastDate = DateTime.now().minus({ months: 1 }).toJSDate();
      const transaction = { ...baseTransaction, date: pastDate };

      mockAccountService.findOne.mockResolvedValue(mockAccount);
      mockAccountService.updateBalance.mockResolvedValue(mockAccount);

      await service.handleCreditPaymentUpdateForDeleteTransaction(
        mockCredit,
        transaction,
      );

      // Revert Expense -> increment
      expect(accountService.updateBalance).toHaveBeenCalledWith(
        'account1',
        'increment',
        100,
      );
      expect(creditService.updateAmount).not.toHaveBeenCalled();
    });

    it('should revert update on credit if transaction is in the current month', async () => {
      const currentDate = DateTime.now().toJSDate();
      const transaction = { ...baseTransaction, date: currentDate };

      mockAccountService.findOne.mockResolvedValue(mockAccount);
      mockCreditService.updateAmount.mockResolvedValue(mockCredit);

      await service.handleCreditPaymentUpdateForDeleteTransaction(
        mockCredit,
        transaction,
      );

      expect(creditService.updateAmount).toHaveBeenCalledWith(
        'credit1',
        'increment',
        100,
      );
      expect(accountService.updateBalance).not.toHaveBeenCalled();
    });
  });
});
