import { useUpdateUserMutation, useUserQuery } from '@/api/user.api';
import {
	UpdateUserSchema,
	type UpdateUserSchemaType,
} from '@shared/schemas/user.schemas';
import { useForm } from '@tanstack/react-form';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader } from '../custom/Loader';
import FormInput from '../form/FormInput';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const UserSettings: FC = () => {
	const { t } = useTranslation('profile');
	const { data: user, isLoading: isLoadingUser } = useUserQuery();
	const navigate = useNavigate();
	const { mutateAsync: updateUser, isPending } = useUpdateUserMutation();

	const form = useForm({
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
		} as UpdateUserSchemaType,
		validators: {
			onSubmit: UpdateUserSchema as any,
		},
		onSubmit: async ({ value }) => {
			try {
				await updateUser(value);
				toast.success(t('successMessages.update'));
				navigate(-1);
			} catch (error: any) {
				console.error('Failed to update profile', error);
				toast.error(error?.response?.data?.message || error.message);
			}
		},
	});

	if (isLoadingUser) {
		return (
			<Card>
				<Loader />
			</Card>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<Card className="p-6">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field
					name="name"
					children={(field) => (
						<div className="space-y-2">
							<FormInput
								label={t('fields.name')}
								field={field}
								required
							/>
						</div>
					)}
				/>
				<form.Field
					name="email"
					children={(field) => (
						<div className="space-y-2">
							<FormInput
								label={t('fields.email')}
								field={field}
								type="email"
								required
							/>
						</div>
					)}
				/>
				<div className="flex justify-end">
					<Button type="submit" disabled={isPending}>
						{t('save')}
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default UserSettings;
