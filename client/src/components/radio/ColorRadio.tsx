import { cn } from '@/lib/utils.ts';
import { ACCOUNT_COLORS } from '@shared/constants/account.constants.ts';
import { Check } from 'lucide-react';
import type { FC } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group.tsx';

export type ColorRadioProps = {
	value: string;
	onValueChange: (value: string) => void;
	className?: string;
};

const ColorRadio: FC<ColorRadioProps> = ({
	value,
	onValueChange,
	className,
}: ColorRadioProps) => {
	return (
		<RadioGroup
			value={value}
			onValueChange={onValueChange}
			className={cn('flex flex-wrap gap-4', className)}
		>
			{ACCOUNT_COLORS.map((color) => (
				<div key={color} className="flex items-center space-x-0">
					<RadioGroupItem
						value={color}
						className="peer sr-only"
						id={`color-${color}`}
					/>
					<label
						htmlFor={`color-${color}`}
						className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-all peer-aria-checked:scale-110 peer-aria-checked:ring-2 peer-aria-checked:ring-offset-2"
						style={{
							backgroundColor: color,
							borderColor: color,
						}}
					>
						{value === color && (
							<Check className="h-6 w-6 text-white" />
						)}
					</label>
				</div>
			))}
		</RadioGroup>
	);
};

export default ColorRadio;
