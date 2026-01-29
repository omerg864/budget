import { cn } from '@/lib/utils.ts';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type ListRendererProps<T> = {
	data: T[] | undefined;
	renderItem: (item: T) => ReactNode;
	className?: string;
	emptyMessage?: string | ReactNode;
};

const ListRenderer = <T,>({
	data,
	renderItem,
	className,
	emptyMessage,
}: ListRendererProps<T>) => {
	const { t } = useTranslation('generic');

	if (!data || data.length === 0) {
		if (!emptyMessage || typeof emptyMessage === 'string') {
			return (
				<div className="text-center text-gray-500">
					{emptyMessage || t('noData')}
				</div>
			);
		}
		return emptyMessage;
	}

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			{data.map((item, index) => (
				<div key={index}>{renderItem(item)}</div>
			))}
		</div>
	);
};

export default ListRenderer;
