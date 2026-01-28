import { cn } from '@/lib/utils.ts';
import { AccountType } from '@shared/constants/account.constants.ts';
import type { AccountEntity } from '@shared/types/account.type.ts';
import { Landmark, TrendingUp, Wallet } from 'lucide-react';
import { useMemo, type ElementType, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import InlineDotList from '../custom/InlineDotList.tsx';
import CurrencyFormatter from '../formatters/CurrencyFormatter.tsx';

export type AccountCardProps = {
	account: AccountEntity | undefined;
	onCardClick: (account: AccountEntity) => void;
};

const AccountCard: FC<AccountCardProps> = ({
	account,
	onCardClick,
}: AccountCardProps) => {
	const { t } = useTranslation('accounts');

	const Icon = useMemo<ElementType>(() => {
		switch (account?.type) {
			case AccountType.BANK:
				return Landmark;
			case AccountType.CASH:
				return Wallet;
			case AccountType.STOCK:
				return TrendingUp;
		}
		return 'div';
	}, [account?.type]);

	if (!account) {
		return null;
	}

	return (
		<div
			key={account.id}
			className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-transform active:scale-[0.98] dark:bg-slate-900"
			onClick={() => onCardClick(account)}
		>
			<div className="flex items-center gap-4">
				<div
					className={cn('rounded-full p-2')}
					style={{
						color: account.color,
						backgroundColor: `${account.color}1A`,
					}}
				>
					<Icon className="h-6 w-6" />
				</div>
				<div>
					<h4 className="font-semibold">{account.name}</h4>
					<InlineDotList
						items={[t(account.type), account.currency]}
					/>
				</div>
			</div>
			<div className="flex flex-col items-end">
				<span
					className={cn(
						'font-bold',
						account.balance < 0
							? 'text-red-500'
							: 'text-gray-900 dark:text-white',
					)}
				>
					<CurrencyFormatter
						amount={account.balance}
						currency={account.currency}
					/>
				</span>
				<span className="text-[10px] text-gray-400">
					{t('balance')}
				</span>
			</div>
		</div>
	);
};

export default AccountCard;
