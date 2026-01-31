import { useAccountsQuery } from '@/api/account.api';
import { useCreditsQuery } from '@/api/credit.api.ts';
import { useUserQuery } from '@/api/user.api.ts';
import AccountCard from '@/components/account/AccountCard.tsx';
import { AccountForm } from '@/components/account/AccountForm';
import CreditCard from '@/components/credit/CreditCard.tsx';
import { CreditForm } from '@/components/credit/CreditForm';
import ListRenderer from '@/components/custom/ListRenderer.tsx';
import MenuButton from '@/components/custom/MenuButton.tsx';
import CurrencyFormatter from '@/components/formatters/CurrencyFormatter.tsx';
import PageTitle from '@/components/layout/PageTitle.tsx';
import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import { convertCurrency } from '@shared/services/transaction.shared-service';
import type { AccountEntity } from '@shared/types/account.type';
import type { CreditEntity } from '@shared/types/credit.type.ts';
import { useMemoizedFn } from 'ahooks';
import { Coins, CreditCardIcon, Landmark, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Accounts() {
	const { t } = useTranslation('accounts');
	const { ledgerId } = usePreferencesStore();
	const { data: user } = useUserQuery();
	const { data: accounts = [] } = useAccountsQuery(ledgerId ?? undefined);
	const { data: credits = [] } = useCreditsQuery(ledgerId ?? undefined);

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [accountToEdit, setAccountToEdit] = useState<AccountEntity | null>(
		null,
	);

	const [isCreditFormOpen, setIsCreditFormOpen] = useState(false);
	const [creditToEdit, setCreditToEdit] = useState<CreditEntity | null>(null);

	const totalAccountsBalance = useMemo(
		() =>
			accounts.reduce(
				(sum, account) => sum + convertCurrency(account.balance),
				0,
			),
		[accounts],
	);

	const totalCreditsBalance = useMemo(
		() =>
			credits.reduce(
				(sum, credit) => sum + convertCurrency(credit.amount),
				0,
			),
		[credits],
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

	if (!ledgerId || !user) return null;

	return (
		<div className="flex flex-col gap-6">
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

			{/* Total Assets Card */}
			<div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
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
									currency={user.defaultCurrency}
								/>
							</h2>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
								{t('totalCredit')}
							</p>
							<h2
								className={cn(
									'mt-1 text-4xl font-bold tracking-tight',
									totalCreditsBalance < 0
										? 'text-red-500'
										: 'text-gray-900 dark:text-white',
								)}
							>
								<CurrencyFormatter
									amount={totalCreditsBalance}
									currency={user.defaultCurrency}
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
				<h3 className="text-lg font-semibold">{t('yourAccounts')}</h3>

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
	);
}
