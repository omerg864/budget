import { useLedgerQuery } from '@/api/ledger.api.ts';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { getIcon } from '@/services/ledger.service.ts';
import { TransactionType } from '@shared/constants/transaction.constants';
import type { LedgerCategory } from '@shared/types/ledger.type';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CategorySelectorProps {
	ledgerId: string;
	value: string | undefined;
	onValueChange: (value: string) => void;
	type: TransactionType;
}

export function CategorySelector({
	ledgerId,
	value,
	onValueChange,
	type,
}: CategorySelectorProps) {
	const { t } = useTranslation('generic');
	const { data: ledger } = useLedgerQuery(ledgerId);
	const [isOpen, setIsOpen] = useState(false);

	const filteredCategories = useMemo(() => {
		return (
			ledger?.categories.filter((category) => category.type === type) ??
			[]
		);
	}, [ledger, type]);

	// Get first 5 categories for initial view
	const initialCategories = filteredCategories.slice(0, 5);
	const remainingCategories = filteredCategories.slice(5);

	const renderCategory = (category: LedgerCategory) => {
		const Icon = getIcon(category.icon);

		return (
			<button
				key={category.id}
				type="button"
				onClick={() => onValueChange(category.id)}
				className={cn(
					'flex flex-col items-center gap-2 p-2 transition-opacity hover:opacity-80',
					value === category.id ? 'opacity-100' : 'opacity-50',
				)}
			>
				<div
					className="flex h-12 w-12 items-center justify-center rounded-full text-white"
					style={{
						color: category.color,
						backgroundColor: `${category.color}1A`,
					}}
				>
					{Icon && <Icon className="h-6 w-6" />}
				</div>
				<span className="text-xs font-medium">{category.name}</span>
			</button>
		);
	};

	return (
		<div className="w-full space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">{t('category')}</span>
				{remainingCategories.length > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsOpen(!isOpen)}
						className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
					>
						{isOpen ? 'Collapse' : 'Expand'}
						{isOpen ? (
							<ChevronDown className="ml-1 h-3 w-3" />
						) : (
							<ChevronRight className="ml-1 h-3 w-3" />
						)}
					</Button>
				)}
			</div>

			<div className="flex flex-wrap gap-4">
				{initialCategories.map(renderCategory)}

				{remainingCategories.length > 0 && (
					<Collapsible open={isOpen} onOpenChange={setIsOpen}>
						<CollapsibleContent className="mt-4 flex flex-wrap gap-4">
							{remainingCategories.map(renderCategory)}
						</CollapsibleContent>
					</Collapsible>
				)}
			</div>
		</div>
	);
}
