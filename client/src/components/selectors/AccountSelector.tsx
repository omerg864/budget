import { useAccountsQuery } from '@/api/account.api.ts';
import { useUsersByLedgerQuery } from '@/api/user.api';
import type { AccountEntity } from '@shared/types/account.type.ts';
import { keyBy } from 'lodash';
import { useMemo, type FC } from 'react';
import type { BaseSelectorProps } from './BaseSelector.tsx';
import BaseSelector from './BaseSelector.tsx';

export type AccountSelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'value' | 'onValueChange'
> & {
	ledgerId: string | undefined;
	value: string | undefined;
	onValueChange: (value: string) => void;
	filter?: (option: AccountEntity) => boolean;
};

const AccountSelector: FC<AccountSelectorProps> = ({
	ledgerId,
	value,
	onValueChange,
	filter,
	...props
}: AccountSelectorProps) => {
	const { data: accounts } = useAccountsQuery(ledgerId);
	const { data: ledgerUsers } = useUsersByLedgerQuery(ledgerId);

	const options = useMemo(() => {
		const accountOptions = filter
			? accounts?.filter((option) => filter(option))
			: accounts;

		const keyedUsers = keyBy(ledgerUsers ?? [], (u) => u.id);

		return (
			accountOptions?.map((account) => ({
				value: account.id,
				label: (
					<span>
						{account.name}
						{account.ownerId
							? ` (${keyedUsers[account.ownerId]?.name || account.ownerId})`
							: ''}
					</span>
				),
			})) || []
		);
	}, [accounts, filter, ledgerUsers]);

	return (
		<BaseSelector
			value={value}
			onValueChange={onValueChange}
			options={options}
			{...props}
		/>
	);
};

export default AccountSelector;
