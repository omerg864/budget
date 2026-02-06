import { cn } from '@/lib/utils.ts';
import type { AnyFieldApi } from '@tanstack/react-form';
import type {
	FC,
	InputHTMLAttributes,
	PropsWithChildren,
	ReactNode,
} from 'react';
import BaseSelector from '../selectors/BaseSelector.tsx';
import { Label } from '../ui/label.tsx';

export type FormSelectInputProps = PropsWithChildren &
	Omit<
		InputHTMLAttributes<HTMLButtonElement>,
		'dir' | 'defaultValue' | 'value'
	> & {
		field: AnyFieldApi;
		label: string;
		options?: {
			value: string;
			label: ReactNode;
		}[];
		containerClassName?: string;
	};

const FormSelectInput: FC<FormSelectInputProps> = ({
	field,
	label,
	required = false,
	placeholder,
	options = [],
	containerClassName,
	className,
	children,
	...props
}: FormSelectInputProps) => {
	const hasErrors =
		!!field.state.meta.errors && field.state.meta.errors.length > 0;

	return (
		<div className={cn('grid gap-2', containerClassName)}>
			<div>
				<Label htmlFor={field.name} className="inline-block">
					{label}
				</Label>
				{required && <span className="text-red-500">*</span>}
			</div>
			{children || (
				<BaseSelector
					value={field.state.value}
					onValueChange={field.handleChange}
					options={options}
					placeholder={placeholder}
					className={cn(
						hasErrors ? 'border-red-500' : undefined,
						className,
					)}
					{...props}
				/>
			)}
			{hasErrors ? (
				<p className="text-xs text-red-500">
					{field.state.meta.errors
						.map((error) => error.message)
						.filter(Boolean)
						.join(', ')}
				</p>
			) : null}
		</div>
	);
};

export default FormSelectInput;
