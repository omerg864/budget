import { TransactionType } from '@shared/constants/transaction.constants';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type TransactionTypeFormatterProps = {
	value: TransactionType;
};

const TransactionTypeFormatter: FC<TransactionTypeFormatterProps> = ({
	value,
}) => {
	const { t } = useTranslation('enums');
	return <span>{t(`TransactionType.${value}`)}</span>;
};

export default TransactionTypeFormatter;
