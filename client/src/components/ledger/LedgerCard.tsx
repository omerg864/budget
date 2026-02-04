import type { LedgerEntity } from '@shared/types/ledger.type';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card.tsx';
import LedgerIcon from './LedgerIcon';

export type LedgerCardProps = {
	ledger: LedgerEntity;
	onCardClick: (ledger: LedgerEntity) => void;
};

const LedgerCard: FC<LedgerCardProps> = ({ ledger, onCardClick }) => {
	const { t } = useTranslation('settings');
	return (
		<Card
			className="p-3 flex flex-row items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors gap-3"
			onClick={() => onCardClick(ledger)}
		>
			<LedgerIcon icon={ledger.icon} color={ledger.color} />
			<div>
				<h3 className="font-semibold text-lg">{ledger.name}</h3>
				<p className="text-sm text-gray-500">
					{ledger.categories?.length || 0} {t('categories')}
				</p>
			</div>
		</Card>
	);
};

export default LedgerCard;
