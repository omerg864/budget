import { TransactionRecurringFrequency } from '@shared/constants/transaction.constants';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type TransactionRecurringFrequencyFormatterProps = {
	value: TransactionRecurringFrequency;
};

const TransactionRecurringFrequencyFormatter: FC<
	TransactionRecurringFrequencyFormatterProps
> = ({ value }) => {
	const { t } = useTranslation('enums');
	return <span>{t(`TransactionRecurringFrequency.${value}`)}</span>;
};

export default TransactionRecurringFrequencyFormatter;
