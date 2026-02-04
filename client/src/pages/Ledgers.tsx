import { useLedgersQuery } from '@/api/ledger.api';
import AddButton from '@/components/custom/AddButton.tsx';
import ListRenderer from '@/components/custom/ListRenderer';
import PageDisplay from '@/components/layout/PageDisplay';
import PageTitle from '@/components/layout/PageTitle';
import LedgerCard from '@/components/ledger/LedgerCard.tsx';
import { LedgerForm } from '@/components/ledger/LedgerForm';
import type { LedgerEntity } from '@shared/types/ledger.type';
import { useMemoizedFn } from 'ahooks';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const Ledgers: FC = () => {
	const { t } = useTranslation('settings');
	const { data: ledgers = [], isLoading } = useLedgersQuery();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [ledgerToEdit, setLedgerToEdit] = useState<LedgerEntity | null>(null);

	const handleCreateLedger = useMemoizedFn(() => {
		setLedgerToEdit(null);
		setIsFormOpen(true);
	});

	const handleEditLedger = useMemoizedFn((ledger: LedgerEntity) => {
		setLedgerToEdit(ledger);
		setIsFormOpen(true);
	});

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<PageDisplay
				isLoading={isLoading}
				fixed={
					<div className="shrink-0 mb-4">
						<PageTitle title={t('ledgers')}>
							<AddButton onAdd={handleCreateLedger} />
						</PageTitle>
					</div>
				}
			>
				<div className="flex-1 overflow-y-auto pb-4 px-1 -mx-1">
					<ListRenderer
						data={ledgers}
						emptyMessage={t('noLedgers')}
						renderItem={(ledger: LedgerEntity) => (
							<LedgerCard
								key={ledger.id}
								ledger={ledger}
								onCardClick={(ledger) =>
									handleEditLedger(ledger)
								}
							/>
						)}
					/>
				</div>
			</PageDisplay>

			<LedgerForm
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				ledgerToEdit={ledgerToEdit}
			/>
		</div>
	);
};

export default Ledgers;
