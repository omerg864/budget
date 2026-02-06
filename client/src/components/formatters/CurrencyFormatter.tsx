import { cn } from '@/lib/utils';
import type { FC } from 'react';

export type CurrencyFormatterProps = Intl.NumberFormatOptions & {
	amount: number;
	currency: string;
	className?: string;
};

const CurrencyFormatter: FC<CurrencyFormatterProps> = ({
	amount,
	currency,
	className,
	...props
}: CurrencyFormatterProps) => {
	return (
		<span className={cn('text-lg font-bold', className)}>
			{new Intl.NumberFormat(undefined, {
				style: 'currency',
				currencyDisplay: 'narrowSymbol',
				currency,
				...props,
			}).format(amount)}
		</span>
	);
};

export default CurrencyFormatter;
