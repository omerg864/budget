import { useLedgersQuery } from '@/api/ledger.api';
import AddButton from '@/components/custom/AddButton.tsx';
import BackButton from '@/components/custom/BackButton';
import ListRenderer from '@/components/custom/ListRenderer';
import PageDisplay from '@/components/layout/PageDisplay';
import PageTitle from '@/components/layout/PageTitle';
import LedgerCard from '@/components/ledger/LedgerCard.tsx';
import { LedgerForm } from '@/components/ledger/LedgerForm';
import type { LedgerEntity } from '@shared/types/ledger.type';
import { useMemoizedFn } from 'ahooks';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const Ledgers: FC = () => {
	const navigate = useNavigate();
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
					<PageTitle
						className="mb-2"
						title={
							<div className="flex items-center gap-2">
								<BackButton onClick={() => navigate(-1)} />
								<h1 className="text-2xl font-bold">
									{t('ledgers')}
								</h1>
							</div>
						}
					>
						<AddButton onAdd={handleCreateLedger} />
					</PageTitle>
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
