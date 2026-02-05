import InlineDotList from '@/components/custom/InlineDotList';
import TransactionTypeFormatter from '@/components/formatters/TransactionTypeFormatter';
import type { LedgerCategory } from '@shared/types/ledger.type';
import type { FC } from 'react';
import CategoryIcon from './CategoryIcon';

interface CategoryCardProps {
	category: LedgerCategory;
	onClick?: () => void;
}

const CategoryCard: FC<CategoryCardProps> = ({ category, onClick }) => {
	return (
		<div
			className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
			onClick={onClick}
		>
			<div className="flex items-center gap-4">
				<CategoryIcon category={category} />
				<div className="flex flex-col">
					<span className="font-medium text-gray-900 dark:text-gray-100">
						{category.name}
					</span>
					<InlineDotList
						items={[
							<TransactionTypeFormatter
								key="type"
								value={category.type}
							/>,
						]}
					/>
				</div>
			</div>
		</div>
	);
};

export default CategoryCard;
