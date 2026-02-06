import { cn } from '@/lib/utils';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useMemoizedFn } from 'ahooks';
import type { FC, InputHTMLAttributes, PropsWithChildren } from 'react';
import { Input } from '../ui/input.tsx';
import { Label } from '../ui/label.tsx';

export type FormInputProps = InputHTMLAttributes<HTMLInputElement> &
	PropsWithChildren & {
		field: AnyFieldApi;
		label: string;
	};

const FormInput: FC<FormInputProps> = ({
	field,
	label,
	required = false,
	children,
	...props
}: FormInputProps) => {
	const hasErrors =
		!!field.state.meta.errors && field.state.meta.errors.length > 0;

	const handleChange = useMemoizedFn(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (props.type === 'number') {
				field.handleChange(Number(e.target.value));
			} else {
				field.handleChange(e.target.value);
			}
		},
	);

	return (
		<div className="grid gap-2">
			<div>
				<Label htmlFor={field.name} className="inline-block">
					{label}
				</Label>
				{required && <span className="text-red-500">*</span>}
			</div>
			{children ? (
				<>{children}</>
			) : (
				<Input
					{...props}
					id={field.name}
					name={field.name}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={handleChange}
					required={required}
					className={cn(
						hasErrors ? 'border-red-500' : undefined,
						props.className,
					)}
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

export default FormInput;
