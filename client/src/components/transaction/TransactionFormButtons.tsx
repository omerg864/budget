import { useBreakpoint } from '@/hooks/useBreakpoint';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../ui/button';
import { DrawerClose } from '../ui/drawer';

export type TransactionFormButtonsProps = PropsWithChildren & {
	onCancel: () => void;
	submitTitle: string;
	cancelTitle: string;
	disabled: boolean;
};

const TransactionFormButtons: FC<TransactionFormButtonsProps> = ({
	onCancel,
	submitTitle,
	cancelTitle,
	disabled,
	children,
}: TransactionFormButtonsProps) => {
	const { isLargerThan } = useBreakpoint();
	const isLargerThanMd = isLargerThan('md');

	// Desktop view
	if (isLargerThanMd)
		return (
			<>
				{children}
				<div className="flex w-full justify-end gap-2">
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={disabled}
					>
						{cancelTitle}
					</Button>
					<Button
						type="submit"
						form="transaction-form"
						disabled={disabled}
					>
						{submitTitle}
					</Button>
				</div>
			</>
		);

	// Mobile view
	return (
		<div className="flex w-full flex-col gap-2">
			{children}
			<Button
				type="submit"
				form="transaction-form"
				disabled={disabled}
				className="w-full"
			>
				{submitTitle}
			</Button>
			<DrawerClose asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className="w-full"
				>
					{cancelTitle}
				</Button>
			</DrawerClose>
		</div>
	);
};

export default TransactionFormButtons;
