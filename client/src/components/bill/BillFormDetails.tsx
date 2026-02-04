import type { AnyFormType } from '@/types/form.type.ts';
import type { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FormDateInput from '../form/FormDateInput.tsx';
import FormInput from '../form/FormInput.tsx';
import FormSelectInput from '../form/FormSelectInput.tsx';
import FormTextareaInput from '../form/FormTextareaInput.tsx';
import { CategorySelector } from '../selectors/CategorySelector.tsx';
import FrequencySelector from '../selectors/FrequencySelector.tsx';
import BillNextCharges from './BillNextCharges';

export type BillFormDetailsProps = {
	form: AnyFormType;
};

const BillFormDetails: FC<BillFormDetailsProps> = ({
	form,
}: BillFormDetailsProps) => {
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
				name="startDate"
				children={(field) => (
					<FormDateInput
						field={field}
						label={t('startDate')}
						required
					/>
				)}
			/>
			<form.Field
				name="endDate"
				children={(field) => (
					<FormDateInput field={field} label={t('endDate')} />
				)}
			/>
			<form.Subscribe
				selector={(state) => state.values}
				children={(values) => (
					<BillNextCharges
						bill={values as RecurringTransactionEntity}
					/>
				)}
			/>

			<form.Field
				name="frequency"
				children={(field) => (
					<FormSelectInput
						field={field}
						label={t('frequency')}
						required
					>
						<FrequencySelector
							value={field.state.value}
							onValueChange={field.handleChange}
						/>
					</FormSelectInput>
				)}
			/>

			<span className="text-muted"></span>

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

export default BillFormDetails;
