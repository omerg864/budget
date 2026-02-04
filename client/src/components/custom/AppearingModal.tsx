import { useBreakpoint } from '@/hooks/useBreakpoint.ts';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '../ui/drawer.tsx';
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '../ui/sheet.tsx';

export type AppearingModalProps = PropsWithChildren & {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: ReactNode;
	footer?: ReactNode;
};

const AppearingModal: FC<AppearingModalProps> = ({
	open,
	onOpenChange,
	title,
	children,
	footer,
}: AppearingModalProps) => {
	const { isOrLargerThan } = useBreakpoint();
	const isDesktop = isOrLargerThan('md');

	if (isDesktop) {
		return (
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent side="right" className="sm:max-w-[425px] p-4">
					<SheetHeader>
						<SheetTitle>{title}</SheetTitle>
					</SheetHeader>
					{children}
					{footer && <SheetFooter>{footer}</SheetFooter>}
				</SheetContent>
			</Sheet>
		);
	}
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className="p-4">
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
				</DrawerHeader>
				<div className="overflow-y-auto">{children}</div>
				{footer && <DrawerFooter>{footer}</DrawerFooter>}
			</DrawerContent>
		</Drawer>
	);
};

export default AppearingModal;
