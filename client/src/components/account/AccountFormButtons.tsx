import { useBreakpoint } from '@/hooks/useBreakpoint.ts';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../ui/button.tsx';
import { DrawerClose } from '../ui/drawer.tsx';

export type AccountFormButtonsProps = PropsWithChildren & {
	onCancel: () => void;
	submitTitle: string;
	cancelTitle: string;
	disabled: boolean;
};

const AccountFormButtons: FC<AccountFormButtonsProps> = ({
	onCancel,
	submitTitle,
	cancelTitle,
	disabled,
	children,
}: AccountFormButtonsProps) => {
	const { isLargerThan } = useBreakpoint();
	const isLargerThanMd = isLargerThan('md');

	if (isLargerThanMd)
		<>
			{children}
			<Button variant="outline" onClick={onCancel} disabled={disabled}>
				{cancelTitle}
			</Button>
			<Button type="submit" form="account-form" disabled={disabled}>
				{submitTitle}
			</Button>
		</>;

	return (
		<>
			{children}
			<Button type="submit" form="account-form" disabled={disabled}>
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

export default AccountFormButtons;
