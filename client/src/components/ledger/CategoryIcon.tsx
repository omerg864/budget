import { cn } from '@/lib/utils.ts';
import { getIcon } from '@/services/ledger.service.ts';
import type { LedgerCategory } from '@shared/types/ledger.type.ts';
import { useMemo, type FC } from 'react';

export type CategoryIconProps = {
	category: LedgerCategory | undefined;
};

const CategoryIcon: FC<CategoryIconProps> = ({
	category,
}: CategoryIconProps) => {
	const { Icon } = useMemo(
		() => ({ Icon: getIcon(category?.icon ?? 'other')! }),
		[category],
	);

	return (
		<div
			className={cn('p-3 rounded-full')}
			style={{
				color: category?.color,
				backgroundColor: `${category?.color}1A`,
			}}
		>
			<Icon className="w-5 h-5" />
		</div>
	);
};

export default CategoryIcon;
