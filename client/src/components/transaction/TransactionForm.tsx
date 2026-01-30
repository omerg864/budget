import { useLedgerQuery } from '@/api/ledger.api';
import {
	useCreateTransactionMutation,
	useUpdateTransactionMutation,
} from '@/api/transaction.api';
import { useUserQuery } from '@/api/user.api';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { TransactionType } from '@shared/constants/transaction.constants';
import {
	CreateTransactionSchema,
	UpdateTransactionSchema,
	type CreateTransactionSchemaType,
} from '@shared/schemas/transaction.schemas';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { useForm } from '@tanstack/react-form';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModal from '../custom/AppearingModal';
import FormDateInput from '../form/FormDateInput';
import FormErrors from '../form/FormErrors';
import FormInput from '../form/FormInput';
import PaymentSelector from '../selectors/PaymentSelector';
import { CategorySelector } from './CategorySelector';
import TransactionFormButtons from './TransactionFormButtons';

interface TransactionFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transactionToEdit?: TransactionEntity | null;
}

export function TransactionForm({
	open,
	onOpenChange,
	transactionToEdit,
}: TransactionFormProps) {
	const { t } = useTranslation('transactions');
	const { data: user } = useUserQuery();
	const ledgerId = user?.defaultLedgerId;
	const { data: ledger } = useLedgerQuery(ledgerId);

	const createTransactionMutation = useCreateTransactionMutation();
	const updateTransactionMutation = useUpdateTransactionMutation();

	const form = useForm({
		defaultValues: {
			description: '',
			amount: 0,
			currency: SupportedCurrencies.ILS, // Default to ILS or infer from user prefs
			paymentId: '',
			paymentType: 'account',
			ledgerId: ledgerId || '',
			date: new Date(),
			type: TransactionType.EXPENSE,
			category: '',
			notes: '',
		} as CreateTransactionSchemaType,
		validators: {
			onSubmit: transactionToEdit
				? UpdateTransactionSchema
				: (CreateTransactionSchema as any),
		},
		onSubmit: async ({ value }) => {
			if (transactionToEdit) {
				try {
					await updateTransactionMutation.mutateAsync({
						id: transactionToEdit.id,
						data: value,
					});
					onOpenChange(false);
				} catch (error: any) {
					console.error('Failed to update transaction', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			} else {
				try {
					await createTransactionMutation.mutateAsync(value);
					onOpenChange(false);
				} catch (error: any) {
					console.error('Failed to create transaction', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			}
		},
	});

	const categories = useMemo(() => ledger?.categories || [], [ledger]);

	const isLoading =
		createTransactionMutation.isPending ||
		updateTransactionMutation.isPending;

	return (
		<AppearingModal
			open={open}
			onOpenChange={onOpenChange}
			title={
				transactionToEdit ? t('editTransaction') : t('addTransaction')
			}
			footer={
				<TransactionFormButtons
					submitTitle={transactionToEdit ? t('save') : t('add')}
					cancelTitle={t('cancel')}
					disabled={isLoading}
					onCancel={() => onOpenChange(false)}
				>
					<form.Subscribe
						selector={(state) => state.errors}
						children={(errors) => (
							<FormErrors errors={Object.values(errors)} />
						)}
					/>
				</TransactionFormButtons>
			}
		>
			<div className="py-6">
				<form
					id="transaction-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="space-y-6">
						{/* TODO: Add TransactionType selector (Expense/Income/Transfer) */}
						<div className="space-y-4">
							{/* Amount - Prominent Display */}
							<form.Field
								name="amount"
								children={(field) => (
									<div className="flex justify-center">
										<div className="flex items-center gap-1 text-4xl font-bold">
											<span>₪</span>{' '}
											{/* TODO: Dynamic currency symbol */}
											<input
												className="w-32 bg-transparent text-center outline-none placeholder:text-gray-300"
												placeholder="0"
												type="number"
												value={field.state.value || ''}
												onChange={(e) =>
													field.handleChange(
														Number(e.target.value),
													)
												}
											/>
										</div>
									</div>
								)}
							/>

							{/* Payment Method Selector */}
							<form.Field
								name="paymentId"
								children={(field) => (
									<PaymentSelector
										ledgerId={ledgerId}
										value={field.state.value}
										valueType={form.getFieldValue(
											'paymentType',
										)}
										onValueChange={(id, type) => {
											field.handleChange(id);
											form.setFieldValue(
												'paymentType',
												type,
											);
										}}
									/>
								)}
							/>

							{/* Category Selector */}
							<form.Field
								name="category"
								children={(field) => (
									<div className="space-y-2">
										<CategorySelector
											categories={categories}
											value={field.state.value}
											onValueChange={field.handleChange}
											type={form.getFieldValue('type')}
										/>
									</div>
								)}
							/>

							{/* Merchant / Description */}
							<form.Field
								name="description"
								children={(field) => (
									<FormInput
										field={field}
										label={t('merchantName')}
										placeholder={t('optional')}
									/>
								)}
							/>

							{/* Notes */}
							<form.Field
								name="notes"
								children={(field) => (
									<FormInput
										field={field}
										label={t('note')}
										placeholder={t('optional')}
									/>
								)}
							/>

							{/* Date */}
							<form.Field
								name="date"
								children={(field) => (
									<FormDateInput
										field={field}
										label={t('date')}
										required
									/>
								)}
							/>
						</div>
					</div>
				</form>
			</div>
		</AppearingModal>
	);
}
