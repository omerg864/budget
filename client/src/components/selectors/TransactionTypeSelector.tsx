import TransactionTypeFormatter from '@/components/formatters/TransactionTypeFormatter';
import { getTransactionTypeIcon } from '@/services/transaction.service';
import { TransactionType } from '@shared/constants/transaction.constants';
import { type FC, useMemo } from 'react';
import type { BaseSelectorProps } from './BaseSelector.tsx';
import BaseSelector from './BaseSelector.tsx';

export type TransactionTypeSelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'value' | 'onValueChange'
> & {
	value: TransactionType | undefined;
	onValueChange: (value: TransactionType) => void;
	filter?: (type: TransactionType) => boolean;
};

const TransactionTypeSelector: FC<TransactionTypeSelectorProps> = ({
	value,
	onValueChange,
	filter,
	...props
}: TransactionTypeSelectorProps) => {
	const options = useMemo(() => {
		const allOptions = [
			{
				value: TransactionType.EXPENSE,
				label: (
					<div className="flex items-center gap-2">
						{getTransactionTypeIcon(TransactionType.EXPENSE)}
						<TransactionTypeFormatter
							value={TransactionType.EXPENSE}
						/>
					</div>
				),
			},
			{
				value: TransactionType.INCOME,
				label: (
					<div className="flex items-center gap-2">
						{getTransactionTypeIcon(TransactionType.INCOME)}
						<TransactionTypeFormatter
							value={TransactionType.INCOME}
						/>
					</div>
				),
			},
		];

		return filter
			? allOptions.filter((option) => filter(option.value))
			: allOptions;
	}, [filter]);

	return (
		<BaseSelector
			value={value}
			onValueChange={(val) => onValueChange(val as TransactionType)}
			options={options}
			{...props}
		/>
	);
};

export default TransactionTypeSelector;
