import { cn } from '@/lib/utils';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useMemoizedFn } from 'ahooks';
import type { FC, PropsWithChildren, TextareaHTMLAttributes } from 'react';
import { Label } from '../ui/label.tsx';
import { Textarea } from '../ui/textarea.tsx';

export type FormTextareaInputProps =
	TextareaHTMLAttributes<HTMLTextAreaElement> &
		PropsWithChildren & {
			field: AnyFieldApi;
			label: string;
		};

const FormTextareaInput: FC<FormTextareaInputProps> = ({
	field,
	label,
	required = false,
	children,
	...props
}: FormTextareaInputProps) => {
	const handleChange = useMemoizedFn(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			field.handleChange(e.target.value);
		},
	);

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
			{children ? (
				<>{children}</>
			) : (
				<Textarea
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

export default FormTextareaInput;
