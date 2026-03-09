import type { AnyFormType } from '@/types/form.type.ts';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FormDateInput from '../form/FormDateInput.tsx';
import FormInput from '../form/FormInput.tsx';
import FormSelectInput from '../form/FormSelectInput.tsx';
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
		<div className="flex flex-col gap-4 w-full">
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

			{/* Category Selector */}
			<form.Subscribe
				selector={(s) => ({
					type: s.values.type,
					ledgerId: s.values.ledgerId,
				})}
			>
				{({ type, ledgerId }) => (
					<form.Field
						name="category"
						children={(field) => (
							<FormSelectInput
								field={field}
								label={t('category')}
								placeholder={t('category')}
							>
								<CategorySelector
									ledgerId={ledgerId}
									value={field.state.value}
									onValueChange={field.handleChange}
									type={type}
									clearable
								/>
							</FormSelectInput>
						)}
					/>
				)}
			</form.Subscribe>

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
		</div>
	);
};

export default TransactionFormDetails;
