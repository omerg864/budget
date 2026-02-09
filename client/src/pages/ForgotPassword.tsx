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
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { CLIENT_ROUTES } from '../../../shared/constants/routes.constants';

const forgotPasswordSchema = z.object({
	email: z.email(),
});

export default function ForgotPassword() {
	const { t } = useTranslation('forgotPassword');
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const form = useForm({
		defaultValues: {
			email: '',
		},
		validators: {
			onSubmit: forgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			setIsLoading(true);
			const { error } = await authClient.requestPasswordReset({
				email: value.email,
				redirectTo: `${window.location.origin}/reset-password`,
			});
			if (error) {
				toast.error(error.message || t('error'));
			} else {
				setIsSuccess(true);
				toast.success(t('success'));
			}
			setIsLoading(false);
		},
	});

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
						{!isSuccess ? (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
								className="space-y-4"
							>
								<form.Field
									name="email"
									children={(field) => (
										<FormInput
											field={field}
											label={t('email')}
											type="email"
											required
											placeholder="m@example.com"
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
						) : (
							<div className="text-center text-sm text-green-600 dark:text-green-400">
								{t('success')}
							</div>
						)}

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
