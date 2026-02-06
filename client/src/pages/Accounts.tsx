import { useAccountsQuery } from '@/api/account.api';
import { useCreditsQuery } from '@/api/credit.api.ts';
import { useGetAllReversedExchangeRates } from '@/api/currency.api';
import { useLedgerQuery } from '@/api/ledger.api';
import { useUserQuery } from '@/api/user.api.ts';
import AccountCard from '@/components/account/AccountCard.tsx';
import { AccountForm } from '@/components/account/AccountForm';
import { TransferForm } from '@/components/account/TransferForm.tsx';
import CreditCard from '@/components/credit/CreditCard.tsx';
import { CreditForm } from '@/components/credit/CreditForm';
import ListRenderer from '@/components/custom/ListRenderer.tsx';
import MenuButton from '@/components/custom/MenuButton.tsx';
import CurrencyFormatter from '@/components/formatters/CurrencyFormatter.tsx';
import PageDisplay from '@/components/layout/PageDisplay.tsx';
import PageTitle from '@/components/layout/PageTitle.tsx';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import { SupportedCurrencies } from '@shared/constants/currency.constants.ts';
import { convertCurrency } from '@shared/services/transaction.shared-service';
import type { AccountEntity } from '@shared/types/account.type';
import type { CreditEntity } from '@shared/types/credit.type.ts';
import { useMemoizedFn } from 'ahooks';
import {
	ArrowRightLeft,
	Coins,
	CreditCardIcon,
	Landmark,
	Plus,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Accounts() {
	const { t } = useTranslation('accounts');
	const { ledgerId } = usePreferencesStore();
	const { data: user, isLoading: isLoadingUser } = useUserQuery();
	const { data: ledger, isLoading: isLoadingLedger } = useLedgerQuery(
		ledgerId ?? undefined,
	);
	const { data: exchangeRates, isLoading: isLoadingExchangeRates } =
		useGetAllReversedExchangeRates(ledger?.currency);
	const { data: accounts = [], isLoading: isLoadingAccounts } =
		useAccountsQuery(ledgerId ?? undefined);
	const { data: credits = [], isLoading: isLoadingCredits } = useCreditsQuery(
		ledgerId ?? undefined,
	);

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [accountToEdit, setAccountToEdit] = useState<AccountEntity | null>(
		null,
	);

	const [isCreditFormOpen, setIsCreditFormOpen] = useState(false);
	const [creditToEdit, setCreditToEdit] = useState<CreditEntity | null>(null);

	const [isTransferOpen, setIsTransferOpen] = useState(false);

	const totalAccountsBalance = useMemo(
		() =>
			accounts.reduce((sum, account) => {
				const rate = exchangeRates?.[account.currency];
				return sum + convertCurrency(account.balance, rate);
			}, 0),
		[accounts, exchangeRates],
	);

	const handleEditAccount = useMemoizedFn((account: AccountEntity) => {
		setAccountToEdit(account);
		setIsCreateOpen(true);
	});

	const handleCreateAccount = useMemoizedFn(() => {
		setAccountToEdit(null);
		setIsCreateOpen(true);
	});

	const handleCreateCredit = useMemoizedFn(() => {
		setCreditToEdit(null);
		setIsCreditFormOpen(true);
	});

	const handleEditCredit = useMemoizedFn((credit: CreditEntity) => {
		setCreditToEdit(credit);
		setIsCreditFormOpen(true);
	});

	const handleTransfer = useMemoizedFn(() => {
		setIsTransferOpen(true);
	});

	const isLoading =
		isLoadingUser ||
		isLoadingAccounts ||
		isLoadingCredits ||
		isLoadingExchangeRates ||
		isLoadingLedger;

	if (!ledgerId) return null;

	return (
		<div className="flex flex-col gap-6 flex-1 overflow-hidden">
			<PageDisplay
				isLoading={isLoading}
				fixed={
					<>
						<PageTitle title={t('title')}>
							<MenuButton
								icon={<Plus className="w-5 h-5" />}
								options={[
									{
										label: (
											<>
												<Landmark />
												{t('addAccount')}
											</>
										),
										onClick: handleCreateAccount,
									},
									{
										label: (
											<>
												<CreditCardIcon />
												{t('addCredit')}
											</>
										),
										onClick: handleCreateCredit,
									},
								]}
							/>
						</PageTitle>

						<AccountForm
							open={isCreateOpen}
							onOpenChange={setIsCreateOpen}
							accountToEdit={accountToEdit}
						/>

						<CreditForm
							open={isCreditFormOpen}
							onOpenChange={setIsCreditFormOpen}
							creditToEdit={creditToEdit}
						/>

						<TransferForm
							open={isTransferOpen}
							onOpenChange={setIsTransferOpen}
						/>
					</>
				}
			>
				<div className="flex-1 overflow-y-auto -mx-1 px-1 pb-4 flex flex-col gap-6">
					{/* Total Assets Card */}
					<div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 shrink-0">
						<div className="flex items-start justify-between">
							<div className="flex gap-8">
								<div>
									<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
										{t('totalAssets')}
									</p>
									<h2
										className={cn(
											'mt-1 text-4xl font-bold tracking-tight',
											totalAccountsBalance < 0
												? 'text-red-500'
												: 'text-gray-900 dark:text-white',
										)}
									>
										<CurrencyFormatter
											amount={totalAccountsBalance}
											currency={
												user?.defaultCurrency ??
												SupportedCurrencies.ILS
											}
										/>
									</h2>
								</div>
							</div>

							<div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
								<Coins className="h-6 w-6" />
							</div>
						</div>
					</div>

					{/* Your Accounts List */}
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">
								{t('yourAccounts')}
							</h3>
							<Button variant="outline" onClick={handleTransfer}>
								<ArrowRightLeft className="w-5 h-5" />
								{t('transfer')}
							</Button>
						</div>

						<div className="flex flex-col gap-3">
							{/* Bank Accounts */}
							<ListRenderer
								data={accounts}
								emptyMessage={t('noAccounts')}
								renderItem={(account) => (
									<AccountCard
										key={account.id}
										account={account}
										onCardClick={handleEditAccount}
									/>
								)}
							/>

							<h3 className="text-lg font-semibold mt-2">
								{t('yourCredits')}
							</h3>

							{/* Credit Cards (Credits) */}
							<ListRenderer
								emptyMessage={t('noCredits')}
								data={credits}
								renderItem={(credit) => (
									<CreditCard
										key={credit.id}
										credit={credit}
										onCardClick={handleEditCredit}
									/>
								)}
							/>
						</div>
					</div>
				</div>
			</PageDisplay>
		</div>
	);
}
