import {
	useCreateCreditMutation,
	useUpdateCreditMutation,
} from '@/api/credit.api';
import { useUserQuery } from '@/api/user.api';
import {
	ACCOUNT_COLORS,
	AccountType,
} from '@shared/constants/account.constants';
import { CreditType } from '@shared/constants/credit.constants';
import {
	CreateCreditSchema,
	UpdateCreditSchema,
	type CreateCreditSchemaType,
} from '@shared/schemas/credit.schemas';
import type { CreditEntity } from '@shared/types/credit.type';
import { useForm } from '@tanstack/react-form';
import { CreditCard, Landmark } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModal from '../custom/AppearingModal.tsx';
import FormErrors from '../form/FormErrors.tsx';
import FormInput from '../form/FormInput.tsx';
import FormSelectInput from '../form/FormSelectInput.tsx';
import ColorRadio from '../radio/ColorRadio.tsx';
import AccountSelector from '../selectors/AccountSelector.tsx';
import UserSelector from '../selectors/UserSelector.tsx';
import CreditFormButtons from './CreditFormButtons.tsx';

interface CreditFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	creditToEdit?: CreditEntity | null;
}

export function CreditForm({
	open,
	onOpenChange,
	creditToEdit,
}: CreditFormProps) {
	const { t } = useTranslation('credits');
	const { t: tAccounts } = useTranslation('accounts');
	const { t: tGeneric } = useTranslation('generic');
	const { data: user } = useUserQuery();

	const creditTypeOptions = useMemo(
		() => [
			{
				value: CreditType.CREDIT,
				label: (
					<div className="flex items-center gap-2">
						<CreditCard className="h-4 w-4" />
						<span>{t('credit')}</span>
					</div>
				),
			},
			{
				value: CreditType.DEBIT,
				label: (
					<div className="flex items-center gap-2">
						<Landmark className="h-4 w-4" />
						<span>{t('debit')}</span>
					</div>
				),
			},
		],
		[t],
	);

	const createCreditMutation = useCreateCreditMutation();
	const updateCreditMutation = useUpdateCreditMutation();

	const form = useForm({
		defaultValues: {
			name: '',
			type: CreditType.CREDIT,
			color: ACCOUNT_COLORS[0],
			ledgerId: user?.defaultLedgerId || '',
			accountId: '',
			ownerId: undefined as string | undefined,
		} as CreateCreditSchemaType,
		validators: {
			onSubmit: creditToEdit
				? UpdateCreditSchema
				: (CreateCreditSchema as any),
		},
		onSubmit: async ({ value }) => {
			if (creditToEdit) {
				try {
					await updateCreditMutation.mutateAsync({
						id: creditToEdit.id,
						data: value,
					});
				} catch (error: any) {
					console.error('Failed to update credit', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			} else {
				try {
					await createCreditMutation.mutateAsync(value);
				} catch (error: any) {
					console.error('Failed to create credit', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			}
			onOpenChange(false);
		},
	});

	// Reset form when opening/closing or changing creditToEdit
	useEffect(() => {
		if (open) {
			if (!user && !creditToEdit) return;

			if (creditToEdit) {
				form.reset({
					name: creditToEdit.name,
					type: creditToEdit.type,
					color: creditToEdit.color || ACCOUNT_COLORS[0],
					ledgerId: creditToEdit.ledgerId,
					accountId: creditToEdit.accountId,
					ownerId: creditToEdit.ownerId,
				});
			} else {
				form.reset({
					name: '',
					type: CreditType.CREDIT,
					color: ACCOUNT_COLORS[0],
					ledgerId: user?.defaultLedgerId || '',
					accountId: '',
					ownerId: undefined,
				});
			}
		}
	}, [open, creditToEdit, user, form]);

	const isLoading =
		createCreditMutation.isPending || updateCreditMutation.isPending;

	return (
		<AppearingModal
			open={open}
			onOpenChange={onOpenChange}
			title={
				creditToEdit
					? t('editCredit', { defaultValue: 'Edit Credit' })
					: tGeneric('addCredit')
			}
			footer={
				<CreditFormButtons
					submitTitle={
						creditToEdit ? tGeneric('save') : tGeneric('add')
					}
					cancelTitle={tGeneric('cancel')}
					disabled={isLoading}
					onCancel={() => onOpenChange(false)}
				>
					<FormErrors form={form} path={[]} />
				</CreditFormButtons>
			}
		>
			<div className="py-6">
				<form
					id="credit-form"
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
											label={tAccounts('accountName')}
											placeholder={'Credit Card Name'}
											required
										/>
									</div>
								)}
							/>

							{creditToEdit ? null : (
								<form.Field
									name="type"
									children={(field) => (
										<div className="space-y-2">
											<FormSelectInput
												field={field}
												label={tAccounts('accountType')}
												options={creditTypeOptions}
												placeholder={tAccounts(
													'accountType',
												)}
												required
											/>
										</div>
									)}
								/>
							)}

							<form.Field
								name="accountId"
								children={(field) => (
									<div className="space-y-2">
										<FormSelectInput
											field={field}
											label={t('linkedAccount', {
												defaultValue: 'Linked Account',
											})}
											required
										>
											<AccountSelector
												ledgerId={user?.defaultLedgerId}
												value={field.state.value}
												filter={(account) =>
													account.type ===
													AccountType.BANK
												}
												onValueChange={
													field.handleChange
												}
												placeholder={tAccounts(
													'accountName',
												)}
											/>
										</FormSelectInput>
									</div>
								)}
							/>

							<form.Field
								name="ownerId"
								children={(field) => (
									<div className="space-y-2">
										<FormSelectInput
											field={field}
											label={tAccounts('owner')}
										>
											<UserSelector
												ledgerId={user?.defaultLedgerId}
												value={field.state.value}
												onValueChange={
													field.handleChange
												}
												placeholder={tAccounts('owner')}
												clearable
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
											label={tAccounts('color')}
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
