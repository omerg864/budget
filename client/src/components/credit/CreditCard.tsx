import { useAccountQuery } from '@/api/account.api.ts';
import { useUserQuery, useUsersByLedgerQuery } from '@/api/user.api.ts';
import { cn } from '@/lib/utils.ts';
import type { CreditEntity } from '@shared/types/credit.type.ts';
import { CreditCardIcon } from 'lucide-react';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import InlineDotList from '../custom/InlineDotList.tsx';
import CurrencyFormatter from '../formatters/CurrencyFormatter.tsx';

export type CreditCardProps = {
	credit: CreditEntity | undefined;
	onCardClick: (credit: CreditEntity) => void;
};

const CreditCard: FC<CreditCardProps> = ({
	credit,
	onCardClick,
}: CreditCardProps) => {
	const { t } = useTranslation('credits');
	const { data: user } = useUserQuery();
	const { data: account } = useAccountQuery(credit?.accountId);
	const { data: ledgerUsers } = useUsersByLedgerQuery(account?.ledgerId);

	const creditDataList = useMemo(() => {
		if (!credit || !user || !account || !ledgerUsers) return [];
		const defaultData = [
			t(credit?.type),
			user?.defaultCurrency,
			account?.name,
		];
		if (credit?.ownerId) {
			defaultData.push(
				ledgerUsers?.find((user) => user.id === credit.ownerId)!.name,
			);
		}
		return defaultData;
	}, [credit, user, account, t, ledgerUsers]);

	if (!credit || !user || !account) return null;

	return (
		<div
			onClick={() => onCardClick(credit)}
			className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-transform active:scale-[0.98] dark:bg-slate-900"
		>
			<div className="flex items-center gap-4">
				<div
					className={cn('rounded-full p-2')}
					style={{
						color: credit.color,
						backgroundColor: `${credit.color}1A`,
					}}
				>
					<CreditCardIcon className="h-6 w-6" />
				</div>
				<div>
					<h4 className="font-semibold">{credit.name}</h4>
					<InlineDotList items={creditDataList} />
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
	);
};

export default CreditCard;
