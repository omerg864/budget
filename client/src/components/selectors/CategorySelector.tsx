import { useLedgerQuery } from '@/api/ledger.api.ts';
import CategoryIcon from '@/components/ledger/CategoryIcon';
import { TransactionType } from '@shared/constants/transaction.constants';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { BaseSelectorProps } from './BaseSelector.tsx';
import BaseSelector from './BaseSelector.tsx';

export type CategorySelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'value' | 'onValueChange'
> & {
	ledgerId: string;
	value: string | undefined;
	onValueChange: (value: string) => void;
	type?: TransactionType;
};

export const CategorySelector: FC<CategorySelectorProps> = ({
	ledgerId,
	value,
	onValueChange,
	type,
	...props
}: CategorySelectorProps) => {
	const { t } = useTranslation('generic');
	const { data: ledger } = useLedgerQuery(ledgerId);

	const options = useMemo(() => {
		let categories = ledger?.categories || [];

		if (type) {
			categories = categories.filter(
				(category) => category.type === type,
			);
		}

		return categories.map((category) => ({
			value: category.id,
			label: (
				<div className="flex items-center gap-2">
					<CategoryIcon
						category={category}
						className="h-8 w-8 p-1.5"
					/>
					<span className="text-sm">{category.name}</span>
				</div>
			),
		}));
	}, [ledger, type]);

	return (
		<BaseSelector
			value={value}
			onValueChange={onValueChange}
			options={options}
			placeholder={t('category')}
			{...props}
		/>
	);
};

export default CategorySelector;
