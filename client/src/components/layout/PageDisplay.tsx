import type { FC, PropsWithChildren, ReactNode } from 'react';
import { Loader } from '../custom/Loader';

export type PageDisplayProps = PropsWithChildren & {
	isLoading?: boolean;
	isError?: boolean;
	error?: string;
	fixed?: ReactNode;
};

const PageDisplay: FC<PageDisplayProps> = ({
	children,
	isLoading = false,
	isError = false,
	error,
	fixed,
}: PageDisplayProps) => {
	if (isError) {
		return (
			<>
				{fixed}
				{error}
			</>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				{fixed}
				<div className="flex h-full justify-center items-center">
					<Loader />
				</div>
			</div>
		);
	}

	return (
		<>
			{fixed}
			{children}
		</>
	);
};

export default PageDisplay;
