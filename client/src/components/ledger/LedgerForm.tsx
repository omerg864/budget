import {
	useCreateLedgerMutation,
	useUpdateLedgerMutation,
} from '@/api/ledger.api';
import { ACCOUNT_COLORS } from '@shared/constants/account.constants'; // Reusing account colors
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { SupportedIcons } from '@shared/constants/ledger.constants';
import {
	CreateLedgerSchema,
	UpdateLedgerSchema,
	type CreateLedgerSchemaType,
} from '@shared/schemas/ledger.schemas';
import type { LedgerEntity } from '@shared/types/ledger.type';
import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModal from '../custom/AppearingModal';
import FormErrors from '../form/FormErrors';
import FormInput from '../form/FormInput';
import FormSelectInput from '../form/FormSelectInput';
import ColorRadio from '../radio/ColorRadio';
import CurrencySelector from '../selectors/CurrencySelector';
import IconSelector from '../selectors/IconSelector';
import LedgerFormButtons from './LedgerFormButtons';

interface LedgerFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	ledgerToEdit?: LedgerEntity | null;
}

export function LedgerForm({
	open,
	onOpenChange,
	ledgerToEdit,
}: LedgerFormProps) {
	const { t } = useTranslation('settings');

	const createLedgerMutation = useCreateLedgerMutation();
	const updateLedgerMutation = useUpdateLedgerMutation();

	const form = useForm({
		defaultValues: {
			name: '',
			currency: SupportedCurrencies.ILS,
			color: ACCOUNT_COLORS[0],
			icon: SupportedIcons.Home,
			categories: [],
		} as CreateLedgerSchemaType,
		validators: {
			onSubmit: ledgerToEdit
				? UpdateLedgerSchema
				: (CreateLedgerSchema as any),
		},
		onSubmit: async ({ value }) => {
			if (ledgerToEdit) {
				try {
					await updateLedgerMutation.mutateAsync({
						id: ledgerToEdit.id,
						data: value,
					});
					toast.success(t('ledgerUpdated'));
				} catch (error: any) {
					console.error('Failed to update ledger', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			} else {
				try {
					await createLedgerMutation.mutateAsync(value);
					toast.success(t('ledgerCreated'));
				} catch (error: any) {
					console.error('Failed to create ledger', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			}
			onOpenChange(false);
		},
	});

	// Reset form when opening/closing or changing ledgerToEdit
	useEffect(() => {
		if (open) {
			if (ledgerToEdit) {
				form.reset({
					name: ledgerToEdit.name,
					currency: ledgerToEdit.currency,
					color: ledgerToEdit.color,
					icon: ledgerToEdit.icon as SupportedIcons,
					categories: ledgerToEdit.categories,
				});
			} else {
				form.reset({
					name: '',
					currency: SupportedCurrencies.ILS,
					color: ACCOUNT_COLORS[0],
					icon: SupportedIcons.Home,
					categories: [],
				});
			}
		}
	}, [open, ledgerToEdit, form]);

	const isLoading =
		createLedgerMutation.isPending || updateLedgerMutation.isPending;

	return (
		<AppearingModal
			open={open}
			onOpenChange={onOpenChange}
			title={ledgerToEdit ? t('editLedger') : t('addLedger')}
			footer={
				<LedgerFormButtons
					submitTitle={ledgerToEdit ? t('save') : t('add')}
					cancelTitle={t('cancel')}
					disabled={isLoading}
					onCancel={() => onOpenChange(false)}
				>
					<FormErrors form={form as any} path={[]} />
				</LedgerFormButtons>
			}
		>
			<div className="py-6">
				<form
					id="ledger-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="space-y-6">
						<div className="space-y-4">
							<form.Field
								name="name"
								children={(field) => (
									<div className="space-y-2">
										<FormInput
											field={field}
											label={t('ledgerName')}
											placeholder={'My Ledger'}
											required
										/>
									</div>
								)}
							/>

							<form.Field
								name="currency"
								children={(field) => (
									<div className="space-y-2">
										<FormSelectInput
											field={field}
											label={t('currency')}
											required
										>
											<CurrencySelector
												value={field.state.value}
												onValueChange={
													field.handleChange
												}
												placeholder={t('currency')}
											/>
										</FormSelectInput>
									</div>
								)}
							/>

							<form.Field
								name="icon"
								children={(field) => (
									<div className="space-y-2">
										<FormSelectInput
											field={field}
											label={t('icon')}
											required
										>
											<IconSelector
												value={field.state.value}
												onValueChange={(val) =>
													field.handleChange(
														val as SupportedIcons,
													)
												}
												placeholder={t('icon')}
											/>
										</FormSelectInput>
									</div>
								)}
							/>

							<form.Field
								name="color"
								children={(field) => (
									<div className="space-y-2">
										<FormInput
											field={field}
											label={t('color')}
											required
										>
											<ColorRadio
												value={field.state.value}
												onValueChange={
													field.handleChange
												}
												className="mt-2"
											/>
										</FormInput>
									</div>
								)}
							/>
						</div>
					</div>
				</form>
			</div>
		</AppearingModal>
	);
}
