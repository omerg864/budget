import { useLedgerQuery } from '@/api/ledger.api';
import AddButton from '@/components/custom/AddButton';
import BackButton from '@/components/custom/BackButton';
import ListRenderer from '@/components/custom/ListRenderer';
import PageDisplay from '@/components/layout/PageDisplay';
import PageTitle from '@/components/layout/PageTitle';
import CategoryCard from '@/components/ledger/CategoryCard';
import CategoryForm from '@/components/ledger/CategoryForm';
import { usePreferencesStore } from '@/stores/usePreferences';
import type { LedgerCategory } from '@shared/types/ledger.type';
import { useMemoizedFn } from 'ahooks';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const Categories: FC = () => {
	const { t } = useTranslation('categories');
	const navigate = useNavigate();
	const { ledgerId } = usePreferencesStore();
	const { data: ledger, isLoading } = useLedgerQuery(ledgerId || '');
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [categoryToEdit, setCategoryToEdit] = useState<LedgerCategory | null>(
		null,
	);

	const handleCreateCategory = useMemoizedFn(() => {
		setCategoryToEdit(null);
		setIsFormOpen(true);
	});

	const handleEditCategory = useMemoizedFn((category: LedgerCategory) => {
		setCategoryToEdit(category);
		setIsFormOpen(true);
	});

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<PageDisplay
				isLoading={isLoading}
				fixed={
					<div className="shrink-0 mb-4">
						<PageTitle
							title={
								<div className="flex items-center gap-2">
									<BackButton onClick={() => navigate(-1)} />
									<h1 className="text-2xl font-bold">
										{t('title')}
									</h1>
								</div>
							}
						>
							<AddButton onAdd={handleCreateCategory} />
						</PageTitle>
					</div>
				}
			>
				<div className="flex-1 overflow-y-auto">
					<ListRenderer
						data={ledger?.categories}
						emptyMessage={t('noCategoriesFound')}
						renderItem={(category) => (
							<CategoryCard
								key={category.id}
								category={category}
								onClick={() => handleEditCategory(category)}
							/>
						)}
					/>
				</div>
			</PageDisplay>

			{ledgerId && (
				<CategoryForm
					open={isFormOpen}
					onOpenChange={setIsFormOpen}
					categoryToEdit={categoryToEdit}
					ledgerId={ledgerId}
				/>
			)}
		</div>
	);
};

export default Categories;
