import {
	SupportedCurrencies,
	SupportedCurrencyData,
} from '@shared/constants/currency.constants';
import { useMemoizedFn } from 'ahooks';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import BaseSelector, { type BaseSelectorProps } from './BaseSelector.tsx';

export type CurrencySelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'value' | 'onValueChange'
> & {
	value: SupportedCurrencies;
	onValueChange: (value: SupportedCurrencies) => void;
	filter?: (option: SupportedCurrencies) => boolean;
};

const CurrencySelector: FC<CurrencySelectorProps> = ({
	value,
	onValueChange,
	filter,
	...props
}: CurrencySelectorProps) => {
	const { t } = useTranslation('currency');

	const options = useMemo(() => {
		const currencyOptions = Object.values(SupportedCurrencyData).map(
			(currency) => ({
				value: currency.value,
				label: `${t(currency.value)} (${currency.symbol})`,
			}),
		);

		return filter
			? currencyOptions.filter((option) => filter(option.value))
			: currencyOptions;
	}, [filter, t]);

	const onChange = useMemoizedFn((value: string | undefined) => {
		onValueChange(value as SupportedCurrencies);
	});

	return (
		<BaseSelector
			value={value}
			onValueChange={onChange}
			options={options}
			{...props}
		/>
	);
};

export default CurrencySelector;
