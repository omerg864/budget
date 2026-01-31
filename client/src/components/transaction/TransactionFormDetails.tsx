import type { AnyFormType } from '@/types/form.type.ts';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FormDateInput from '../form/FormDateInput.tsx';
import FormInput from '../form/FormInput.tsx';
import FormTextareaInput from '../form/FormTextareaInput.tsx';
import { CategorySelector } from '../selectors/CategorySelector.tsx';

export type TransactionFormDetailsProps = {
	form: AnyFormType;
};

const TransactionFormDetails: FC<TransactionFormDetailsProps> = ({
	form,
}: TransactionFormDetailsProps) => {
	const { t } = useTranslation('transactions');
	return (
		<>
			{/* Category Selector */}
			<form.Field
				name="category"
				children={(field) => (
					<div className="space-y-2">
						<CategorySelector
							ledgerId={form.getFieldValue('ledgerId')}
							value={field.state.value}
							onValueChange={field.handleChange}
							type={form.getFieldValue('type')}
						/>
					</div>
				)}
			/>

			{/* Description */}
			<form.Field
				name="description"
				children={(field) => (
					<FormInput
						field={field}
						label={t('description')}
						placeholder={t('description')}
						required
					/>
				)}
			/>

			{/* Date */}
			<form.Field
				name="date"
				children={(field) => (
					<FormDateInput field={field} label={t('date')} required />
				)}
			/>

			{/* Notes */}
			<form.Field
				name="notes"
				children={(field) => (
					<FormTextareaInput
						field={field}
						label={t('notes')}
						placeholder={t('notes')}
					/>
				)}
			/>
		</>
	);
};

export default TransactionFormDetails;
