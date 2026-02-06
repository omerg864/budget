import { cn } from '@/lib/utils';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { FC } from 'react';
import { DatePicker } from '../custom/DatePicker';
import { Label } from '../ui/label';

interface FormDateInputProps {
	field: AnyFieldApi;
	label: string;
	required?: boolean;
	placeholder?: string;
	className?: string;
}

const FormDateInput: FC<FormDateInputProps> = ({
	field,
	label,
	required = false,
	placeholder,
	className,
}) => {
	const hasErrors =
		!!field.state.meta.errors && field.state.meta.errors.length > 0;

	return (
		<div className="grid gap-2">
			<div>
				<Label htmlFor={field.name} className="inline-block">
					{label}
				</Label>
				{required && <span className="text-red-500">*</span>}
			</div>
			<DatePicker
				date={field.state.value}
				setDate={(date) => field.handleChange(date)}
				placeholder={placeholder}
				className={cn(
					hasErrors ? 'border-red-500' : undefined,
					className,
				)}
			/>
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

export default FormDateInput;
