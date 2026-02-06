import { useLedgerQuery } from '@/api/ledger.api';
import {
	useCreateRecurringTransactionMutation,
	useDeleteRecurringTransactionMutation,
	useUpdateRecurringTransactionMutation,
	type CreateRecurringTransactionDto,
} from '@/api/recurring-transaction.api';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import {
	TransactionPaymentType,
	TransactionRecurringFrequency,
	TransactionType,
} from '@shared/constants/transaction.constants';
import {
	CreateRecurringTransactionSchema,
	UpdateRecurringTransactionSchema,
} from '@shared/schemas/recurringTransaction.schemas';
import type { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type';
import { useForm } from '@tanstack/react-form';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModalForm from '../form/AppearingModalForm';
import BillFormBaseData from './BillFormBaseData';
import BillFormDetails from './BillFormDetails';

interface BillFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	billToEdit?: RecurringTransactionEntity | null;
}

const formName = 'bill-form';

export function BillForm({ open, onOpenChange, billToEdit }: BillFormProps) {
	const { t } = useTranslation('transactions');
	const { ledgerId } = usePreferencesStore();
	const { data: ledger } = useLedgerQuery(ledgerId ?? undefined);
	const [formState, setFormState] = useState<'base' | 'details'>('base');

	const createMutation = useCreateRecurringTransactionMutation();
	const updateMutation = useUpdateRecurringTransactionMutation();
	const deleteMutation = useDeleteRecurringTransactionMutation();

	const form = useForm({
		defaultValues: {
			description: '',
			amount: 0,
			currency: ledger?.currency ?? SupportedCurrencies.ILS,
			paymentId: '',
			paymentType: 'account',
			ledgerId: ledgerId || '',
			startDate: new Date(),
			type: TransactionType.EXPENSE,
			category: '',
			notes: '',
			frequency: TransactionRecurringFrequency.MONTHLY,
		} as CreateRecurringTransactionDto,
		validators: {
			onSubmit: billToEdit
				? UpdateRecurringTransactionSchema
				: (CreateRecurringTransactionSchema as any),
		},
		onSubmit: async ({ value }) => {
			if (billToEdit) {
				try {
					await updateMutation.mutateAsync({
						id: billToEdit.id,
						data: value,
					});
					toast.success(t('billUpdated'));
					onOpenChange(false);
					resetForm();
				} catch (error: any) {
					console.error('Failed to update bill', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			} else {
				try {
					await createMutation.mutateAsync(value);
					toast.success(t('billCreated'));
					onOpenChange(false);
					resetForm();
				} catch (error: any) {
					console.error('Failed to create bill', error);
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
		if (!billToEdit) return;
		try {
			await deleteMutation.mutateAsync(billToEdit.id);
			onOpenChange(false);
			toast.success(t('billDeleted'));
		} catch (error: any) {
			console.error('Failed to delete bill', error);
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
		(values: CreateRecurringTransactionDto) => {
			return !!values.paymentId && !!values.amount;
		},
	);

	const isLoading =
		createMutation.isPending ||
		updateMutation.isPending ||
		deleteMutation.isPending;

	useEffect(() => {
		if (open) {
			if (billToEdit) {
				form.reset({
					description: billToEdit.description,
					type: billToEdit.type,
					amount: billToEdit.amount,
					currency: billToEdit.currency,
					ledgerId: billToEdit.ledgerId,
					startDate: new Date(billToEdit.startDate),
					endDate: billToEdit.endDate
						? new Date(billToEdit.endDate)
						: undefined,
					category: billToEdit.category,
					notes: billToEdit.notes,
					paymentId: billToEdit.paymentId,
					paymentType: billToEdit.paymentType,
					frequency: billToEdit.frequency,
				});
			} else {
				form.reset({
					description: '',
					type: TransactionType.EXPENSE,
					amount: 0,
					currency: ledger?.currency ?? SupportedCurrencies.ILS,
					ledgerId: ledgerId || '',
					startDate: new Date(),
					endDate: undefined,
					paymentId: '',
					paymentType: TransactionPaymentType.ACCOUNT,
					frequency: TransactionRecurringFrequency.MONTHLY,
				});
			}
		}
	}, [open, billToEdit, form, ledgerId, ledger]);

	return (
		<AppearingModalForm
			form={form}
			formName={formName}
			open={open}
			onOpenChange={onChangeOpen}
			title={billToEdit ? t('editBill') : t('addBill')}
			cancelTitle={t('cancel')}
			submitTitle={billToEdit ? t('save') : t('add')}
			onCancel={closeForm}
			next={formState === 'base'}
			onNext={() => setFormState('details')}
			onBack={() => setFormState('base')}
			backButton={formState === 'details'}
			deleteButton={!!billToEdit}
			onDelete={handleDelete}
			disabled={isLoading}
			validateNext={validateNext}
			formClassName="pt-6"
		>
			{formState === 'base' && (
				<BillFormBaseData form={form} billToEdit={billToEdit} />
			)}
			{formState === 'details' && <BillFormDetails form={form} />}
		</AppearingModalForm>
	);
}
