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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { CLIENT_ROUTES } from '../../../shared/constants/routes.constants';

export default function VerifyEmail() {
	const { t } = useTranslation('verification');
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading',
	);

	useEffect(() => {
		const verify = async () => {
			const token = searchParams.get('token');
			if (!token) {
				setStatus('error');
				return;
			}

			const { error } = await authClient.verifyEmail({
				query: {
					token,
				},
			});

			if (error) {
				setStatus('error');
			} else {
				setStatus('success');
			}
		};

		verify();
	}, [searchParams]);

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
							{status === 'loading' && t('description')}
							{status === 'success' && t('success')}
							{status === 'error' && t('error')}
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4">
						<Button
							className="w-full"
							onClick={() => navigate(CLIENT_ROUTES.LOGIN)}
						>
							{t('backToLogin')}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
