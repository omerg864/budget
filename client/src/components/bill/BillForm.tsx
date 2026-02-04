import {
	useCreateRecurringTransactionMutation,
	useUpdateRecurringTransactionMutation,
	type CreateRecurringTransactionDto,
} from '@/api/recurring-transaction.api';
import { useUserQuery } from '@/api/user.api.ts';
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
import AppearingModal from '../custom/AppearingModal';
import FormErrors from '../form/FormErrors';
import { Button } from '../ui/button';
import BillFormBaseData from './BillFormBaseData';
import BillFormButtons from './BillFormButtons';
import BillFormDetails from './BillFormDetails';

interface BillFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	billToEdit?: RecurringTransactionEntity | null;
}

export function BillForm({ open, onOpenChange, billToEdit }: BillFormProps) {
	const { t } = useTranslation('transactions');
	const { ledgerId } = usePreferencesStore();
	const { data: user } = useUserQuery();
	const [formState, setFormState] = useState<'base' | 'details'>('base');

	const createMutation = useCreateRecurringTransactionMutation();
	const updateMutation = useUpdateRecurringTransactionMutation();

	const form = useForm({
		defaultValues: {
			description: '',
			amount: 0,
			currency: user?.defaultCurrency ?? SupportedCurrencies.ILS,
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

	const onChangeOpen = useMemoizedFn((open: boolean) => {
		if (!open) {
			resetForm();
		}
		onOpenChange(open);
	});

	const isLoading = createMutation.isPending || updateMutation.isPending;

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
					currency: user?.defaultCurrency ?? SupportedCurrencies.ILS,
					ledgerId: ledgerId || '',
					startDate: new Date(),
					endDate: undefined,
					paymentId: '',
					paymentType: TransactionPaymentType.ACCOUNT,
					frequency: TransactionRecurringFrequency.MONTHLY,
				});
			}
		}
	}, [open, billToEdit, form, ledgerId, user]);

	return (
		<AppearingModal
			open={open}
			onOpenChange={onChangeOpen}
			title={
				<div className="relative">
					{formState === 'details' ? (
						<Button
							className="absolute left-0 top-1/2 -translate-y-1/2"
							onClick={() => setFormState('base')}
						>
							Back
						</Button>
					) : null}
					{billToEdit ? t('editBill') : t('addBill')}
				</div>
			}
			footer={
				<BillFormButtons
					submitTitle={billToEdit ? t('save') : t('add')}
					cancelTitle={t('cancel')}
					form={form}
					onCancel={closeForm}
					next={formState === 'base'}
					isLoading={isLoading}
					onNext={() => setFormState('details')}
				>
					<FormErrors form={form} path={[]} />
				</BillFormButtons>
			}
		>
			<form
				id="bill-form"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="pt-6"
			>
				{formState === 'base' && (
					<BillFormBaseData form={form} billToEdit={billToEdit} />
				)}
				{formState === 'details' && <BillFormDetails form={form} />}
			</form>
		</AppearingModal>
	);
}
