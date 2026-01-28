import type { FC, ReactNode } from 'react';

export type InlineDotListProps = {
	items: (ReactNode | string)[];
};

const InlineDotList: FC<InlineDotListProps> = ({
	items,
}: InlineDotListProps) => {
	return (
		<ul className="flex flex-wrap items-center text-gray-600">
			{items.map((item, index) => (
				<li
					key={index}
					className="after:content-['•'] after:mx-1 last:after:hidden"
				>
					{item}
				</li>
			))}
		</ul>
	);
};

export default InlineDotList;
