import type { FC } from 'react';

export type CurrencyFormatterProps = {
	amount: number;
	currency: string;
};

const CurrencyFormatter: FC<CurrencyFormatterProps> = ({
	amount,
	currency,
}: CurrencyFormatterProps) => {
	return (
		<span className="text-lg font-bold">
			{new Intl.NumberFormat(undefined, {
				style: 'currency',
				currency,
			}).format(amount)}
		</span>
	);
};

export default CurrencyFormatter;
