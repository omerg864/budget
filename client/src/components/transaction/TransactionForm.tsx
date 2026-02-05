import {
	useCreateTransactionMutation,
	useDeleteTransactionMutation,
	useUpdateTransactionMutation,
} from '@/api/transaction.api';
import { useUserQuery } from '@/api/user.api.ts';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import {
	TransactionPaymentType,
	TransactionType,
} from '@shared/constants/transaction.constants';
import {
	CreateTransactionSchema,
	UpdateTransactionSchema,
	type CreateTransactionSchemaType,
} from '@shared/schemas/transaction.schemas';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { useForm } from '@tanstack/react-form';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModalForm from '../form/AppearingModalForm';
import TransactionFormBaseData from './TransactionFormBaseData.tsx';
import TransactionFormDetails from './TransactionFormDetails.tsx';

interface TransactionFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transactionToEdit?: TransactionEntity | null;
}

const formName = 'transaction-form';

export function TransactionForm({
	open,
	onOpenChange,
	transactionToEdit,
}: TransactionFormProps) {
	const { t } = useTranslation('transactions');
	const { ledgerId } = usePreferencesStore();
	const { data: user } = useUserQuery();
	const [formState, setFormState] = useState<'base' | 'details'>('base');

	const createTransactionMutation = useCreateTransactionMutation();
	const updateTransactionMutation = useUpdateTransactionMutation();
	const deleteTransactionMutation = useDeleteTransactionMutation();

	const form = useForm({
		defaultValues: {
			description: '',
			amount: 0,
			currency: user?.defaultCurrency ?? SupportedCurrencies.ILS,
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

	const handleDelete = useMemoizedFn(async () => {
		if (!transactionToEdit) return;
		try {
			await deleteTransactionMutation.mutateAsync(transactionToEdit.id);
			onOpenChange(false);
			resetForm();
		} catch (error: any) {
			console.error('Failed to delete transaction', error);
			toast.error(error?.response?.data?.message || error.message);
		}
	});

	const onChangeOpen = useMemoizedFn((open: boolean) => {
		if (!open) {
			resetForm();
		}
		onOpenChange(open);
	});

	const validateNext = useMemoizedFn(
		(values: CreateTransactionSchemaType) => {
			return !!values.paymentId && !!values.amount;
		},
	);

	const isLoading =
		createTransactionMutation.isPending ||
		updateTransactionMutation.isPending ||
		deleteTransactionMutation.isPending;

	useEffect(() => {
		if (open) {
			if (!transactionToEdit) return;

			if (transactionToEdit) {
				form.reset({
					description: transactionToEdit.description,
					type: transactionToEdit.type,
					amount: transactionToEdit.amount,
					currency: transactionToEdit.currency,
					ledgerId: transactionToEdit.ledgerId,
					date: transactionToEdit.date,
					category: transactionToEdit.category,
					notes: transactionToEdit.notes,
					paymentId: transactionToEdit.paymentId,
					paymentType: transactionToEdit.paymentType,
				});
			} else {
				form.reset({
					description: '',
					type: TransactionType.EXPENSE,
					amount: 0,
					currency: user?.defaultCurrency ?? SupportedCurrencies.ILS,
					ledgerId: ledgerId || '',
					date: new Date(),
					paymentId: '',
					paymentType: TransactionPaymentType.ACCOUNT,
				});
			}
		}
	}, [open, transactionToEdit, form, ledgerId, user]);

	return (
		<AppearingModalForm
			form={form}
			formName={formName}
			open={open}
			onOpenChange={onChangeOpen}
			title={
				transactionToEdit ? t('editTransaction') : t('addTransaction')
			}
			cancelTitle={t('cancel')}
			submitTitle={transactionToEdit ? t('save') : t('add')}
			onCancel={closeForm}
			next={formState === 'base'}
			onNext={() => setFormState('details')}
			onBack={() => setFormState('base')}
			backButton={formState === 'details'}
			deleteButton={!!transactionToEdit}
			onDelete={handleDelete}
			disabled={isLoading}
			validateNext={validateNext}
			formClassName="py-6"
		>
			{formState === 'base' && (
				<TransactionFormBaseData
					form={form}
					transactionToEdit={transactionToEdit}
				/>
			)}
			{formState === 'details' && <TransactionFormDetails form={form} />}
		</AppearingModalForm>
	);
}
