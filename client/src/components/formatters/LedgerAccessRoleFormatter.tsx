import { LedgerAccessRole } from '@shared/constants/ledger.constants';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type LedgerAccessRoleFormatterProps = {
	value: LedgerAccessRole;
};

const LedgerAccessRoleFormatter: FC<LedgerAccessRoleFormatterProps> = ({
	value,
}) => {
	const { t } = useTranslation('enums');
	return <span>{t(`LedgerAccessRole.${value}`)}</span>;
};

export default LedgerAccessRoleFormatter;
