import { CreditType } from '@shared/constants/credit.constants';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type CreditTypeFormatterProps = {
	value: CreditType;
};

const CreditTypeFormatter: FC<CreditTypeFormatterProps> = ({ value }) => {
	const { t } = useTranslation('enums');
	return <span>{t(`CreditType.${value}`)}</span>;
};

export default CreditTypeFormatter;
