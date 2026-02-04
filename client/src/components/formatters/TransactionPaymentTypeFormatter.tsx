import { TransactionPaymentType } from '@shared/constants/transaction.constants';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type TransactionPaymentTypeFormatterProps = {
	value: TransactionPaymentType;
};

const TransactionPaymentTypeFormatter: FC<
	TransactionPaymentTypeFormatterProps
> = ({ value }) => {
	const { t } = useTranslation('enums');
	return <span>{t(`TransactionPaymentType.${value}`)}</span>;
};

export default TransactionPaymentTypeFormatter;
