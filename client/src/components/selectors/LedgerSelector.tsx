import { useLedgersQuery } from '@/api/ledger.api';
import { useMemo } from 'react';
import LedgerIcon from '../ledger/LedgerIcon.tsx';
import BaseSelector, { type BaseSelectorProps } from './BaseSelector';

export type LedgerSelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'value' | 'onValueChange'
> & {
	value: string | undefined;
	onValueChange: (ledgerId: string) => void;
};

export default function LedgerSelector({
	value,
	onValueChange,
	...props
}: LedgerSelectorProps) {
	const { data: ledgers = [] } = useLedgersQuery();

	const options = useMemo(() => {
		return ledgers.map((ledger) => {
			return {
				value: ledger.id,
				label: (
					<div className="flex items-center gap-2">
						<LedgerIcon icon={ledger.icon} color={ledger.color} />
						<span className="text-base truncate">
							{ledger.name}
						</span>
					</div>
				),
			};
		});
	}, [ledgers]);

	if (ledgers.length === 0) {
		return null;
	}

	return (
		<BaseSelector
			value={value}
			onValueChange={onValueChange}
			options={options}
			{...props}
		/>
	);
}
