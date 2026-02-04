import { useBreakpoint } from '@/hooks/useBreakpoint.ts';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../ui/button.tsx';
import { DrawerClose } from '../ui/drawer.tsx';

export type LedgerFormButtonsProps = PropsWithChildren & {
	onCancel: () => void;
	submitTitle: string;
	cancelTitle: string;
	disabled: boolean;
};

const LedgerFormButtons: FC<LedgerFormButtonsProps> = ({
	onCancel,
	submitTitle,
	cancelTitle,
	disabled,
	children,
}: LedgerFormButtonsProps) => {
	const { isLargerThan } = useBreakpoint();
	const isLargerThanMd = isLargerThan('md');

	if (isLargerThanMd) {
		return (
			<>
				{children}
				<Button
					variant="outline"
					onClick={onCancel}
					disabled={disabled}
				>
					{cancelTitle}
				</Button>
				<Button type="submit" form="ledger-form" disabled={disabled}>
					{submitTitle}
				</Button>
			</>
		);
	}

	return (
		<>
			{children}
			<Button type="submit" form="ledger-form" disabled={disabled}>
				{submitTitle}
			</Button>
			<DrawerClose asChild>
				<Button variant="outline" disabled={disabled}>
					{cancelTitle}
				</Button>
			</DrawerClose>
		</>
	);
};

export default LedgerFormButtons;
