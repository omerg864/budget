import { useAccountsQuery } from '@/api/account.api.ts';
import type { AccountEntity } from '@shared/types/account.type.ts';
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

	const options = useMemo(() => {
		const accountOptions = filter
			? accounts?.filter((option) => filter(option))
			: accounts;

		return (
			accountOptions?.map((account) => ({
				value: account.id,
				label: account.name,
			})) || []
		);
	}, [accounts, filter]);

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
