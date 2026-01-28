import { cn } from '@/lib/utils.ts';
import type { FC, InputHTMLAttributes, ReactNode } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select.tsx';

export type BaseSelectorProps = Omit<
	InputHTMLAttributes<HTMLButtonElement>,
	'dir' | 'value' | 'defaultValue'
> & {
	value: string | undefined;
	onValueChange: (value: string | undefined) => void;
	options: {
		value: string;
		label: ReactNode;
	}[];
	className?: string;
	placeholder?: string;
};

const BaseSelector: FC<BaseSelectorProps> = ({
	value,
	onValueChange,
	options,
	className,
	placeholder,
	...porps
}: BaseSelectorProps) => {
	return (
		<Select value={value} onValueChange={onValueChange} {...porps}>
			<SelectTrigger
				className={cn('w-auto bg-white dark:bg-slate-950', className)}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default BaseSelector;
