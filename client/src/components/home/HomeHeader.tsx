import { useTranslation } from 'react-i18next';

export default function HomeHeader() {
	const { t } = useTranslation('home');
	return (
		<header className="flex w-full items-center gap-2 border-b bg-white p-4 shadow-sm dark:bg-slate-950 dark:border-slate-800">
			<img
				src="/icon512.png"
				alt="Flow App Icon"
				className="h-8 w-8 rounded-lg"
			/>
			<span className="text-lg font-bold text-slate-900 dark:text-white">
				{t('header.title')}
			</span>
		</header>
	);
}
