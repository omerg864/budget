import { cn } from '@/lib/utils.ts';
import { X } from 'lucide-react';
import type { FC, InputHTMLAttributes, ReactNode } from 'react';
import { Button } from '../ui/button.tsx';
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
	onValueChange: (value: string) => void;
	options: {
		value: string;
		label: ReactNode;
	}[];
	className?: string;
	placeholder?: string;
	clearable?: boolean;
};

const BaseSelector: FC<BaseSelectorProps> = ({
	value,
	onValueChange,
	options,
	className,
	placeholder,
	clearable = false,
	...porps
}: BaseSelectorProps) => {
	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		onValueChange('');
	};

	return (
		<Select value={value} onValueChange={onValueChange} {...porps}>
			<div className="flex w-full gap-1">
				<SelectTrigger
					className={cn(
						'w-full bg-white dark:bg-slate-950',
						className,
					)}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				{clearable && value && (
					<Button
						variant="ghost"
						size="icon"
						role="button"
						onClick={handleClear}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
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
