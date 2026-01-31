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
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModal from '../custom/AppearingModal';
import FormErrors from '../form/FormErrors';
import TransactionFormBaseData from './TransactionFormBaseData.tsx';
import TransactionFormButtons from './TransactionFormButtons';
import TransactionFormDetails from './TransactionFormDetails.tsx';

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
	const [formState, setFormState] = useState<'base' | 'details'>('base');

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
					resetForm();
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
					resetForm();
				} catch (error: any) {
					console.error('Failed to create transaction', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			}
		},
	});

	const resetForm = useMemoizedFn(() => {
		setFormState('base');
		form.reset();
	});

	const closeForm = useMemoizedFn(() => {
		onOpenChange(false);
		resetForm();
	});

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
					form={form}
					onCancel={closeForm}
					next={formState === 'base'}
					isLoading={isLoading}
					onNext={() => setFormState('details')}
				>
					<FormErrors form={form} path={[]} />
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
					{formState === 'base' && (
						<TransactionFormBaseData
							form={form}
							transactionToEdit={transactionToEdit}
						/>
					)}
					{formState === 'details' && (
						<TransactionFormDetails form={form} />
					)}
				</form>
			</div>
		</AppearingModal>
	);
}
