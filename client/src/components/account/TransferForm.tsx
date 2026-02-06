import { useTransferMutation } from '@/api/account.api';
import { useUserQuery } from '@/api/user.api.ts';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import { SupportedCurrencies } from '@shared/constants/currency.constants.ts';
import {
	TransferSchema,
	type TransferSchemaType,
} from '@shared/schemas/account.schemas';
import { useForm } from '@tanstack/react-form';
import { ArrowRightLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import AppearingModalForm from '../form/AppearingModalForm';
import FormInput from '../form/FormInput.tsx';
import FormSelectInput from '../form/FormSelectInput.tsx';
import FormTextareaInput from '../form/FormTextareaInput.tsx';
import AccountSelector from '../selectors/AccountSelector.tsx';
import CurrencySelector from '../selectors/CurrencySelector.tsx';

interface TransferFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const formName = 'transfer-form';

export function TransferForm({ open, onOpenChange }: TransferFormProps) {
	const { t } = useTranslation('accounts');
	const { ledgerId } = usePreferencesStore();
	const { data: user } = useUserQuery();

	const transferMutation = useTransferMutation();

	const defaultCurrency = user?.defaultCurrency ?? SupportedCurrencies.ILS;

	const form = useForm({
		defaultValues: {
			fromAccountId: '',
			toAccountId: '',
			amount: 0,
			currency: defaultCurrency,
			date: new Date(),
			notes: '',
		} as TransferSchemaType,
		validators: {
			onSubmit: TransferSchema as any,
		},
		onSubmit: async ({ value }) => {
			try {
				await transferMutation.mutateAsync(value);
				toast.success(t('transferSuccess'));
				onOpenChange(false);
			} catch (error: any) {
				console.error('Failed to transfer', error);
				toast.error(error?.response?.data?.message || error.message);
			}
		},
	});

	const changeFromAccount = (accountId: string) => {
		form.setFieldValue('fromAccountId', accountId);
		form.setFieldValue('toAccountId', '');
	};

	// Reset form when opening
	useEffect(() => {
		if (open) {
			form.reset({
				fromAccountId: '',
				toAccountId: '',
				amount: 0,
				currency: defaultCurrency,
				date: new Date(),
				notes: '',
			});
		}
	}, [open, form, defaultCurrency]);

	const isLoading = transferMutation.isPending;

	return (
		<AppearingModalForm
			open={open}
			onOpenChange={onOpenChange}
			title={
				<div className="flex items-center gap-2">
					<ArrowRightLeft className="w-5 h-5" />
					{t('transferMoney')}
				</div>
			}
			form={form}
			formName={formName}
			submitTitle={t('transfer')}
			cancelTitle={t('cancel')}
			disabled={isLoading}
			onCancel={() => onOpenChange(false)}
			formClassName="py-6"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<form.Field
						name="fromAccountId"
						children={(field) => (
							<div className="space-y-2">
								<FormSelectInput
									field={field}
									label={t('fromAccount')}
									required
								>
									<AccountSelector
										ledgerId={ledgerId ?? undefined}
										value={field.state.value}
										onValueChange={changeFromAccount}
										placeholder={t('selectAccount')}
									/>
								</FormSelectInput>
							</div>
						)}
					/>

					<form.Field
						name="toAccountId"
						children={(field) => (
							<div className="space-y-2">
								<FormSelectInput
									field={field}
									label={t('toAccount')}
									required
								>
									<form.Subscribe
										selector={(state) =>
											state.values.fromAccountId
										}
										children={(fromAccountId) => (
											<AccountSelector
												ledgerId={ledgerId ?? undefined}
												value={field.state.value}
												onValueChange={
													field.handleChange
												}
												placeholder={t('selectAccount')}
												filter={(account) =>
													account.id !== fromAccountId
												}
											/>
										)}
									/>
								</FormSelectInput>
							</div>
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<form.Field
						name="amount"
						children={(field) => (
							<div className="space-y-2">
								<FormInput
									field={field}
									label={t('amount')}
									type="number"
									placeholder={'0.00'}
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
										onValueChange={field.handleChange}
										placeholder={t('currency')}
									/>
								</FormSelectInput>
							</div>
						)}
					/>
				</div>

				<form.Field
					name="notes"
					children={(field) => (
						<div className="space-y-2">
							<FormTextareaInput
								field={field}
								label={t('notes')}
								placeholder={t('transferNotes')}
							/>
						</div>
					)}
				/>
			</div>
		</AppearingModalForm>
	);
}
