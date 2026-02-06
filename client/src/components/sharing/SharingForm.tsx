import { useAddUserMutation } from '@/api/ledger.api';
import { usePreferencesStore } from '@/stores/usePreferences';
import { AddUserSchema } from '@shared/schemas/ledger.schemas';
import { useForm } from '@tanstack/react-form';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { LedgerAccessRole } from '../../../../shared/constants/ledger.constants';
import AppearingModalForm from '../form/AppearingModalForm';
import FormInput from '../form/FormInput';
import FormSelectInput from '../form/FormSelectInput';
import LedgerAccessRoleFormatter from '../formatters/LedgerAccessRoleFormatter';

interface SharingFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const formName = 'sharing-form';

export const SharingForm: FC<SharingFormProps> = ({ open, onOpenChange }) => {
	const { t } = useTranslation('sharing');
	const { ledgerId } = usePreferencesStore();
	const { mutateAsync: addUser, isPending } = useAddUserMutation();

	const roleOptions = useMemo(
		() => [
			{
				value: LedgerAccessRole.FULL_ACCESS,
				label: (
					<LedgerAccessRoleFormatter
						value={LedgerAccessRole.FULL_ACCESS}
					/>
				),
			},
			{
				value: LedgerAccessRole.READ_ONLY,
				label: (
					<LedgerAccessRoleFormatter
						value={LedgerAccessRole.READ_ONLY}
					/>
				),
			},
		],
		[],
	);

	const form = useForm({
		defaultValues: {
			email: '',
			role: LedgerAccessRole.FULL_ACCESS,
		},
		onSubmit: async ({ value }) => {
			try {
				await addUser({ ledgerId: ledgerId!, values: value });
				toast.success(t('userAdded'));
				form.reset();
				onOpenChange(false);
			} catch (error: any) {
				toast.error(error?.response?.data?.message || error.message);
			}
		},
		validators: {
			onSubmit: AddUserSchema,
		},
	});

	return (
		<AppearingModalForm
			open={open}
			onOpenChange={onOpenChange}
			title={t('addUser')}
			form={form}
			formName={formName}
			submitTitle={t('invite')}
			cancelTitle={t('cancel')}
			disabled={isPending}
			onCancel={() => onOpenChange(false)}
		>
			<div className="space-y-4">
				<form.Field
					name="email"
					children={(field) => (
						<div className="space-y-2">
							<FormInput
								field={field}
								label={t('email')}
								placeholder="user@example.com"
								required
							/>
						</div>
					)}
				/>
				<form.Field
					name="role"
					children={(field) => (
						<div className="space-y-2">
							<FormSelectInput
								field={field}
								label={t('role')}
								options={roleOptions}
								required
							/>
						</div>
					)}
				/>
			</div>
		</AppearingModalForm>
	);
};
