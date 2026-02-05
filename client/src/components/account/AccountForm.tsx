import {
	useCreateAccountMutation,
	useDeleteAccountMutation,
	useUpdateAccountMutation,
} from '@/api/account.api';
import { useUserQuery } from '@/api/user.api.ts';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import {
	ACCOUNT_COLORS,
	AccountType,
} from '@shared/constants/account.constants';
import { SupportedCurrencies } from '@shared/constants/currency.constants.ts';
import {
	CreateAccountSchema,
	UpdateAccountSchema,
	type CreateAccountSchemaType,
} from '@shared/schemas/account.schemas';
import type { AccountEntity } from '@shared/types/account.type';
import { useForm } from '@tanstack/react-form';
import { useMemoizedFn } from 'ahooks';
import { Landmark, LineChart, Wallet } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModalForm from '../form/AppearingModalForm';
import FormInput from '../form/FormInput.tsx';
import FormSelectInput from '../form/FormSelectInput.tsx';
import ColorRadio from '../radio/ColorRadio.tsx';
import CurrencySelector from '../selectors/CurrencySelector.tsx';
import UserSelector from '../selectors/UserSelector.tsx';

interface AccountFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	accountToEdit?: AccountEntity | null;
}

const formName = 'account-form';

export function AccountForm({
	open,
	onOpenChange,
	accountToEdit,
}: AccountFormProps) {
	const { t } = useTranslation('accounts');
	const { ledgerId } = usePreferencesStore();
	const { data: user } = useUserQuery();

	const accountTypeOptions = useMemo(
		() => [
			{
				value: AccountType.BANK,
				label: (
					<div className="flex items-center gap-2">
						<Landmark className="h-4 w-4" />
						<span>{t('bank')}</span>
					</div>
				),
			},
			{
				value: AccountType.CASH,
				label: (
					<div className="flex items-center gap-2">
						<Wallet className="h-4 w-4" />
						<span>{t('cash')}</span>
					</div>
				),
			},
			{
				value: AccountType.STOCK,
				label: (
					<div className="flex items-center gap-2">
						<LineChart className="h-4 w-4" />
						<span>{t('stock')}</span>
					</div>
				),
			},
		],
		[t],
	);

	const createAccountMutation = useCreateAccountMutation();
	const updateAccountMutation = useUpdateAccountMutation();
	const deleteAccountMutation = useDeleteAccountMutation();

	const form = useForm({
		defaultValues: {
			name: '',
			type: AccountType.BANK,
			currency: SupportedCurrencies.ILS,
			balance: 0,
			color: ACCOUNT_COLORS[0],
			ledgerId: ledgerId || '',
		} as CreateAccountSchemaType,
		validators: {
			onSubmit: accountToEdit
				? UpdateAccountSchema
				: (CreateAccountSchema as any),
		},
		onSubmit: async ({ value }) => {
			if (accountToEdit) {
				try {
					await updateAccountMutation.mutateAsync({
						id: accountToEdit.id,
						data: value,
					});
					toast.success(t('accountUpdated'));
					onOpenChange(false);
				} catch (error: any) {
					console.error('Failed to update account', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			} else {
				try {
					await createAccountMutation.mutateAsync(value);
					toast.success(t('accountCreated'));
					onOpenChange(false);
				} catch (error: any) {
					console.error('Failed to create account', error);
					toast.error(
						error?.response?.data?.message || error.message,
					);
				}
			}
		},
	});

	// Reset form when opening/closing or changing accountToEdit
	useEffect(() => {
		if (open) {
			if (!accountToEdit) return;

			if (accountToEdit) {
				form.reset({
					name: accountToEdit.name,
					type: accountToEdit.type,
					balance: accountToEdit.balance,
					color: accountToEdit.color || ACCOUNT_COLORS[0],
					ledgerId: accountToEdit.ledgerId,
					currency: accountToEdit.currency,
					ownerId: accountToEdit.ownerId,
				});
			} else {
				form.reset({
					name: '',
					type: AccountType.BANK,
					balance: 0,
					color: ACCOUNT_COLORS[0],
					ledgerId: ledgerId || '',
					currency: user?.defaultCurrency ?? SupportedCurrencies.ILS,
				});
			}
		}
	}, [open, accountToEdit, form, ledgerId, user]);

	const handleDelete = useMemoizedFn(async () => {
		if (!accountToEdit) return;
		try {
			await deleteAccountMutation.mutateAsync(accountToEdit.id);
			onOpenChange(false);
			toast.success(t('accountDeleted'));
		} catch (error: any) {
			console.error('Failed to delete account', error);
			toast.error(error?.response?.data?.message || error.message);
		}
	});

	const isLoading =
		createAccountMutation.isPending ||
		updateAccountMutation.isPending ||
		deleteAccountMutation.isPending;

	return (
		<AppearingModalForm
			open={open}
			onOpenChange={onOpenChange}
			title={accountToEdit ? t('editAccount') : t('addAccount')}
			form={form}
			formName={formName}
			submitTitle={accountToEdit ? t('save') : t('add')}
			cancelTitle={t('cancel')}
			disabled={isLoading}
			onCancel={() => onOpenChange(false)}
			deleteButton={!!accountToEdit}
			onDelete={handleDelete}
			formClassName="py-6"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<form.Field
						name="name"
						children={(field) => (
							<div className="space-y-2">
								<FormInput
									field={field}
									label={t('accountName')}
									placeholder={t('bankInc')}
									required
								/>
							</div>
						)}
					/>

					{accountToEdit ? null : (
						<form.Field
							name="type"
							children={(field) => (
								<div className="space-y-2">
									<FormSelectInput
										field={field}
										label={t('accountType')}
										options={accountTypeOptions}
										placeholder={t('accountType')}
										required
									/>
								</div>
							)}
						/>
					)}

					<form.Field
						name="balance"
						children={(field) => (
							<div className="space-y-2">
								<FormInput
									field={field}
									label={
										accountToEdit
											? t('balance')
											: t('initialBalance')
									}
									type="number"
									placeholder={'12,345.67'}
									required
								/>
							</div>
						)}
					/>

					{accountToEdit ? null : (
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
											onValueChange={field.handleChange}
											placeholder={t('currency')}
										/>
									</FormSelectInput>
								</div>
							)}
						/>
					)}

					<form.Field
						name="ownerId"
						children={(field) => (
							<div className="space-y-2">
								<FormSelectInput
									field={field}
									label={t('owner')}
								>
									<UserSelector
										ledgerId={ledgerId ?? undefined}
										value={field.state.value}
										onValueChange={field.handleChange}
										placeholder={t('owner')}
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
									label={t('color')}
									required
								>
									<ColorRadio
										value={field.state.value}
										onValueChange={field.handleChange}
										className="mt-2"
									/>
								</FormInput>
							</div>
						)}
					/>
				</div>
			</div>
		</AppearingModalForm>
	);
}
