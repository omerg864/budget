import { useUsersByLedgerQuery } from '@/api/user.api.ts';
import { cn } from '@/lib/utils.ts';
import { AccountType } from '@shared/constants/account.constants.ts';
import type { AccountEntity } from '@shared/types/account.type.ts';
import { useMemoizedFn } from 'ahooks';
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
	const { t: tGeneric } = useTranslation('generic');
	const { t } = useTranslation('accounts');
	const { data: ledgerUsers } = useUsersByLedgerQuery(account?.ledgerId);

	const getIcon = useMemoizedFn((): ElementType => {
		switch (account?.type) {
			case AccountType.BANK:
				return Landmark;
			case AccountType.CASH:
				return Wallet;
			case AccountType.STOCK:
				return TrendingUp;
		}
		return 'div';
	});

	const { accountDataList, Icon } = useMemo<{
		accountDataList: string[];
		Icon: ElementType;
	}>(() => {
		if (!account || !ledgerUsers)
			return { accountDataList: [], Icon: 'div' };
		const defaultData = [t(account.type), account.currency];
		if (account.ownerId) {
			defaultData.push(
				ledgerUsers?.find((user) => user.id === account.ownerId)
					?.name ?? tGeneric('unknown'),
			);
		}

		return { accountDataList: defaultData, Icon: getIcon() };
	}, [account, ledgerUsers, t, tGeneric, getIcon]);

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
					<InlineDotList items={accountDataList} />
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
