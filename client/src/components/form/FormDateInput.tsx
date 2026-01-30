import type { AnyFieldApi } from '@tanstack/react-form';
import type { FC } from 'react';
import { DatePicker } from '../custom/DatePicker';
import { Label } from '../ui/label';

interface FormDateInputProps {
	field: AnyFieldApi;
	label: string;
	required?: boolean;
}

const FormDateInput: FC<FormDateInputProps> = ({
	field,
	label,
	required = false,
}) => {
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
			/>
			{field.state.meta.errors ? (
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
