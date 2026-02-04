import type { LedgerCategory } from '@shared/types/ledger.type.ts';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export type CategoryNameFormatterProps = {
	value: LedgerCategory['name'] | undefined;
};

const CategoryNameFormatter: FC<CategoryNameFormatterProps> = ({
	value,
}: CategoryNameFormatterProps) => {
	const { t } = useTranslation('generic');
	return <span>{value || t('other')}</span>;
};

export default CategoryNameFormatter;
