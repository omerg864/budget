import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HomeHeader() {
	const { t } = useTranslation('home');
	return (
		<header className="flex w-full items-center gap-2 border-b bg-white p-4 shadow-sm dark:bg-slate-950 dark:border-slate-800">
			<div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900">
				<Wallet className="h-5 w-5" />
			</div>
			<span className="text-lg font-bold text-slate-900 dark:text-white">
				{t('header.title')}
			</span>
		</header>
	);
}
