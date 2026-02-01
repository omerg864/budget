import { cn } from '@/lib/utils.ts';
import type { FC, PropsWithChildren, ReactNode } from 'react';

export type PageTitleProps = PropsWithChildren & {
	title: string | ReactNode;
	className?: string;
};

const PageTitle: FC<PageTitleProps> = ({
	title,
	children,
	className,
}: PageTitleProps) => {
	return (
		<div className={cn('flex items-center justify-between', className)}>
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
