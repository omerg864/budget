import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { CLIENT_ROUTES } from '../../../../shared/constants/routes.constants';

export default function Hero() {
	const { t } = useTranslation('home');
	return (
		<section className="flex flex-col items-center justify-center px-4 pt-20 pb-12 text-center md:pt-32">
			<div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl dark:bg-slate-900">
				<Wallet className="h-10 w-10 text-slate-900 dark:text-white" />
			</div>

			<h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl dark:text-white">
				{t('hero.title')}
			</h1>

			<p className="max-w-[600px] text-lg text-slate-600 md:text-xl dark:text-slate-400">
				{t('hero.description')}
			</p>

			<div className="mt-8 flex w-full max-w-sm flex-col gap-4 sm:flex-row sm:justify-center">
				<Button
					asChild
					size="lg"
					className="w-full text-lg shadow-lg sm:w-auto"
				>
					<Link to={CLIENT_ROUTES.REGISTER}>
						{t('hero.getStarted')}
					</Link>
				</Button>
				<Button
					asChild
					variant="outline"
					size="lg"
					className="w-full border-slate-200 bg-white text-lg shadow-sm hover:bg-slate-50 sm:w-auto dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
				>
					<Link to={CLIENT_ROUTES.LOGIN}>{t('hero.logIn')}</Link>
				</Button>
			</div>
		</section>
	);
}
