import type { FC, PropsWithChildren, ReactNode } from 'react';

export type PageTitleProps = PropsWithChildren & {
	title: string | ReactNode;
};

const PageTitle: FC<PageTitleProps> = ({ title, children }: PageTitleProps) => {
	return (
		<div className="flex items-center justify-between">
			{typeof title === 'string' ? (
				<h1 className="text-2xl font-bold">{title}</h1>
			) : (
				title
			)}
			{children}
		</div>
	);
};

export default PageTitle;
