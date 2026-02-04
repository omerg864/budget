import { AccountType } from '@shared/constants/account.constants';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type AccountTypeFormatterProps = {
	value: AccountType;
};

const AccountTypeFormatter: FC<AccountTypeFormatterProps> = ({ value }) => {
	const { t } = useTranslation('enums');
	return <span>{t(`AccountType.${value}`)}</span>;
};

export default AccountTypeFormatter;
