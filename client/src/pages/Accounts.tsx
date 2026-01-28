import { useAccountsQuery, useCreditsQuery } from '@/api/account.api';
import { useUserQuery } from '@/api/user.api';
import AccountCard from '@/components/account/AccountCard.tsx';
import { AccountForm } from '@/components/account/AccountForm';
import AddButton from '@/components/custom/AddButton.tsx';
import CurrencyFormatter from '@/components/formatters/CurrencyFormatter.tsx';
import PageTitle from '@/components/layout/PageTitle.tsx';
import { cn } from '@/lib/utils';
import { CreditType } from '@shared/constants/credit.constants';
import type { AccountEntity } from '@shared/types/account.type';
import { useMemoizedFn } from 'ahooks';
import { Coins, CreditCard } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Accounts() {
	const { t } = useTranslation('accounts');
	const { data: user } = useUserQuery();
	const { data: accounts = [] } = useAccountsQuery(user?.defaultLedgerId);
	const { data: credits = [] } = useCreditsQuery(user?.defaultLedgerId);

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [accountToEdit, setAccountToEdit] = useState<AccountEntity | null>(
		null,
	);

	const totalAccountsBalance = useMemo(
		() => accounts.reduce((sum, account) => sum + account.balance, 0),
		[accounts],
	);

	const totalCreditsBalance = useMemo(
		() => credits.reduce((sum, credit) => sum + credit.amount, 0),
		[credits],
	);

	const totalAssets = totalAccountsBalance + totalCreditsBalance;

	const handleEditAccount = useMemoizedFn((account: AccountEntity) => {
		setAccountToEdit(account);
		setIsCreateOpen(true);
	});

	const handleCreateAccount = useMemoizedFn(() => {
		setAccountToEdit(null);
		setIsCreateOpen(true);
	});

	if (!user) return null;

	return (
		<div className="flex flex-col gap-6">
			<PageTitle title={t('title')}>
				<AddButton onAdd={handleCreateAccount} />
			</PageTitle>

			<AccountForm
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
				accountToEdit={accountToEdit}
			/>

			{/* Total Assets Card */}
			<div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
							{t('totalAssets')}
						</p>
						<h2
							className={cn(
								'mt-1 text-4xl font-bold tracking-tight',
								totalAssets < 0
									? 'text-red-500'
									: 'text-gray-900 dark:text-white',
							)}
						>
							<CurrencyFormatter
								amount={totalAssets}
								currency="ILS"
							/>
						</h2>
					</div>
					<div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
						<Coins className="h-6 w-6" />
					</div>
				</div>

				<div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
					<div className="flex flex-col items-center gap-1">
						<span className="text-lg font-bold">
							{accounts.length + credits.length}
						</span>
						<span className="text-xs text-gray-400">
							{t('accounts')}
						</span>
					</div>
					<div className="flex flex-col items-center gap-1">
						<span className="text-lg font-bold">
							{accounts.length}
						</span>
						<span className="text-xs text-gray-400">
							{t('bank')}
						</span>
					</div>
					<div className="flex flex-col items-center gap-1">
						<span className="text-lg font-bold">
							{credits.length}
						</span>
						<span className="text-xs text-gray-400">
							{t('cards')}
						</span>
					</div>
				</div>
			</div>

			{/* Your Accounts List */}
			<div className="flex flex-col gap-4">
				<h3 className="text-lg font-semibold">{t('yourAccounts')}</h3>

				<div className="flex flex-col gap-3">
					{/* Bank Accounts */}
					{accounts.map((account) => (
						<AccountCard
							key={account.id}
							account={account}
							onCardClick={handleEditAccount}
						/>
					))}

					{/* Credit Cards (Credits) */}
					{credits.map((credit) => (
						<div
							key={credit.id}
							className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-transform active:scale-[0.98] dark:bg-slate-900"
						>
							<div className="flex items-center gap-4">
								<div className="rounded-full bg-orange-100 p-3 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400">
									<CreditCard className="h-6 w-6" />
								</div>
								<div>
									<h4 className="font-semibold">
										{credit.name}
									</h4>
									<p className="text-xs text-gray-400">
										{credit.type === CreditType.CREDIT
											? t('cards')
											: credit.type}{' '}
										• {user.defaultCurrency}
									</p>
								</div>
							</div>
							<div className="flex flex-col items-end">
								<span
									className={cn(
										'font-bold',
										credit.amount < 0
											? 'text-red-500'
											: 'text-gray-900 dark:text-white',
									)}
								>
									<CurrencyFormatter
										amount={credit.amount}
										currency={user.defaultCurrency}
									/>
								</span>
								<span className="text-[10px] text-gray-400">
									{t('balance')}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
