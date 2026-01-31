import { cn } from '@/lib/utils';
import type { FC } from 'react';

export type CurrencyFormatterProps = {
	amount: number;
	currency: string;
	className?: string;
};

const CurrencyFormatter: FC<CurrencyFormatterProps> = ({
	amount,
	currency,
	className,
}: CurrencyFormatterProps) => {
	return (
		<span className={cn('text-lg font-bold', className)}>
			{new Intl.NumberFormat(undefined, {
				style: 'currency',
				currency,
			}).format(amount)}
		</span>
	);
};

export default CurrencyFormatter;
