import { useUsersByLedgerQuery } from '@/api/user.api.ts';
import type { UserEntity } from '@shared/types/user.type.ts';
import { useMemo, type FC } from 'react';
import type { BaseSelectorProps } from './BaseSelector.tsx';
import BaseSelector from './BaseSelector.tsx';

export type UserSelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'value' | 'onValueChange'
> & {
	ledgerId: string | undefined;
	value: UserEntity['id'] | undefined;
	onValueChange: (value: UserEntity['id'] | undefined) => void;
	filter?: (option: UserEntity) => boolean;
};

const UserSelector: FC<UserSelectorProps> = ({
	ledgerId,
	value,
	onValueChange,
	filter,
	...props
}: UserSelectorProps) => {
	const { data: users } = useUsersByLedgerQuery(ledgerId);

	const options = useMemo(() => {
		const userOptions = filter
			? users?.filter((option) => filter(option))
			: users;

		return (
			userOptions?.map((user) => ({
				value: user.id,
				label: user.name,
			})) || []
		);
	}, [users, filter]);

	return (
		<BaseSelector
			value={value}
			onValueChange={onValueChange}
			options={options}
			{...props}
		/>
	);
};

export default UserSelector;
