import { useUpdateUserMutation, useUserQuery } from '@/api/user.api';
import BackButton from '@/components/custom/BackButton.tsx';
import FormInput from '@/components/form/FormInput';
import PageTitle from '@/components/layout/PageTitle.tsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card.tsx';
import {
	UpdateUserSchema,
	type UpdateUserSchemaType,
} from '@shared/schemas/user.schemas';
import { useForm } from '@tanstack/react-form';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const Profile: FC = () => {
	const { t } = useTranslation('profile');
	const { data: user } = useUserQuery();
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

	if (!user) {
		return null;
	}

	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			<div className="shrink-0 p-4">
				<PageTitle
					title={
						<div className="flex items-center gap-2">
							<BackButton onClick={() => navigate(-1)} />
							<h1 className="text-2xl font-bold">{t('title')}</h1>
						</div>
					}
				/>
			</div>

			<div className="flex flex-col flex-1 overflow-y-auto px-4 pb-4">
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
			</div>
		</div>
	);
};

export default Profile;
