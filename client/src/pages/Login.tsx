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
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import type { UserEntity } from '@shared/types/user.type.ts';
import { useForm } from '@tanstack/react-form';
import { SmartphoneNfc } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { CLIENT_ROUTES } from '../../../shared/constants/routes.constants';

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});
export default function Login() {
	const { t } = useTranslation('login');
	const [isLoading, setIsLoading] = useState(false);
	const setLedgerId = usePreferencesStore((state) => state.setLedgerId);
	const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: loginSchema,
		},
		onSubmit: async ({ value }) => {
			setIsLoading(true);
			const { error, data } = await authClient.signIn.email({
				email: value.email,
				password: value.password,
				callbackURL: '/',
			});
			if (error) {
				toast.error(error.message || 'Failed to sign in');
			} else {
				setLedgerId(
					(data?.user as unknown as UserEntity).defaultLedgerId,
				);
				setAuthenticated();
				navigate(CLIENT_ROUTES.HOME);
			}
			setIsLoading(false);
		},
	});

	const handleGoogleSignIn = async () => {
		const { error, data } = await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/', // Redirect to home after login
		});
		if (error) {
			toast.error(error.message || 'Failed to sign in with Google');
		} else {
			setLedgerId(
				((data as any)?.user as unknown as UserEntity).defaultLedgerId,
			);
			setAuthenticated();
			navigate(CLIENT_ROUTES.HOME);
		}
	};

	const handlePasskeySignIn = async () => {
		const { error, data } = await authClient.signIn.passkey();
		if (error) {
			toast.error(error?.message || 'Failed to sign in with Passkey');
		} else {
			setLedgerId((data?.user as unknown as UserEntity).defaultLedgerId);
			setAuthenticated();
			navigate(CLIENT_ROUTES.HOME);
		}
	};

	return (
		<div>
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
							<Button
								className="w-full"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? '...' : t('signIn')}
							</Button>
						</form>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-slate-200 dark:border-slate-800" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
									{t('or')}
								</span>
							</div>
						</div>

						<Button
							variant="outline"
							className="w-full"
							onClick={handleGoogleSignIn}
						>
							<svg
								className="mr-2 h-4 w-4"
								aria-hidden="true"
								focusable="false"
								data-prefix="fab"
								data-icon="google"
								role="img"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 488 512"
							>
								<path
									fill="currentColor"
									d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
								></path>
							</svg>
							{t('signInWithGoogle')}
						</Button>

						<Button
							variant="default"
							className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
							onClick={handlePasskeySignIn}
						>
							<SmartphoneNfc className="mr-2 h-4 w-4" />
							{t('signInWithPasskey')}
						</Button>

						<div className="mt-4 text-center text-sm">
							{t('dontHaveAccount')}{' '}
							<Link
								to={CLIENT_ROUTES.REGISTER}
								className="underline underline-offset-4 hover:text-primary"
							>
								{t('signUp')}
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
