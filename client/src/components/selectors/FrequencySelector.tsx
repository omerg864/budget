import { TransactionRecurringFrequency } from '@shared/constants/transaction.constants';
import { useMemoizedFn } from 'ahooks';
import { useMemo, type FC } from 'react';
import TransactionRecurringFrequencyFormatter from '../formatters/TransactionRecurringFrequencyFormatter.tsx';
import BaseSelector, { type BaseSelectorProps } from './BaseSelector';

export type FrequencySelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'onValueChange'
> & {
	onValueChange: (value: TransactionRecurringFrequency) => void;
};

const FrequencySelector: FC<FrequencySelectorProps> = ({
	onValueChange,
	...props
}) => {
	const frequencyOptions = useMemo<
		Array<{
			value: TransactionRecurringFrequency;
			label: React.ReactNode;
		}>
	>(
		() =>
			Object.values(TransactionRecurringFrequency).map((frequency) => ({
				value: frequency,
				label: (
					<TransactionRecurringFrequencyFormatter value={frequency} />
				),
			})),
		[],
	);

	const onChange = useMemoizedFn((value: string) => {
		onValueChange(value as TransactionRecurringFrequency);
	});

	return (
		<BaseSelector
			{...props}
			options={frequencyOptions}
			onValueChange={onChange}
		/>
	);
};

export default FrequencySelector;
