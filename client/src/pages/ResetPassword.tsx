import FormInput from '@/components/form/FormInput';
import HomeHeader from '@/components/home/HomeHeader.tsx';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/clients/auth.client';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { CLIENT_ROUTES } from '../../../shared/constants/routes.constants';

const resetPasswordSchema = z
	.object({
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export default function ResetPassword() {
	const { t } = useTranslation('resetPassword');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	const form = useForm({
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
		validators: {
			onSubmit: resetPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			if (!token) {
				toast.error('Missing reset token');
				return;
			}
			setIsLoading(true);
			const { error } = await authClient.resetPassword({
				newPassword: value.password,
				token,
			});
			if (error) {
				toast.error(error.message || t('error'));
			} else {
				toast.success(t('success'));
				navigate(CLIENT_ROUTES.LOGIN);
			}
			setIsLoading(false);
		},
	});

	if (!token) {
		return (
			<div className="flex min-h-screen flex-col">
				<HomeHeader />
				<div className="flex flex-1 items-center justify-center px-4">
					<Card className="w-full max-w-md border-none shadow-xl dark:bg-slate-900">
						<CardContent className="pt-6 text-center text-red-500">
							Invalid or missing reset token.
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<HomeHeader />
			<div className="flex flex-1 items-center justify-center px-4">
				<Card className="w-full max-w-md border-none shadow-xl dark:bg-slate-900">
					<CardHeader className="space-y-1 text-center">
						<CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
							{t('title')}
						</CardTitle>
						<CardDescription className="text-slate-500 dark:text-slate-400">
							{t('description')}
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
							className="space-y-4"
						>
							<form.Field
								name="password"
								children={(field) => (
									<FormInput
										field={field}
										label={t('password')}
										type="password"
										required
									/>
								)}
							/>
							<form.Field
								name="confirmPassword"
								children={(field) => (
									<FormInput
										field={field}
										label={t('confirmPassword')}
										type="password"
										required
									/>
								)}
							/>
							<Button
								className="w-full"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? '...' : t('submit')}
							</Button>
						</form>

						<div className="mt-4 text-center text-sm">
							<Link
								to={CLIENT_ROUTES.LOGIN}
								className="underline underline-offset-4 hover:text-primary"
							>
								{t('backToLogin')}
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
