import { SupportedIcons } from '@shared/constants/ledger.constants';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type SupportedIconsFormatterProps = {
	value: SupportedIcons;
};

const SupportedIconsFormatter: FC<SupportedIconsFormatterProps> = ({
	value,
}) => {
	const { t } = useTranslation('enums');
	return <span>{t(`SupportedIcons.${value}`)}</span>;
};

export default SupportedIconsFormatter;
