import { cn } from '@/lib/utils';
import type { FC } from 'react';
import { Button } from '../ui/button.tsx';
import BackArrow from './BackArrow.tsx';

export type BackButtonProps = {
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
};

const BackButton: FC<BackButtonProps> = ({ onClick, className, disabled }) => {
	return (
		<Button
			size="icon"
			className={cn(
				'h-10 w-10 rounded-full bg-slate-100 text-black hover:bg-slate-200 dark:bg-slate-800 dark:text-white',
				className,
			)}
			onClick={onClick}
			disabled={disabled}
		>
			<BackArrow className="h-5 w-5" />
		</Button>
	);
};

export default BackButton;
