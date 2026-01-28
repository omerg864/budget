import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Receipt, SmartphoneNfc, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/home/Hero';
import HomeHeader from '../components/home/HomeHeader';

// Mock data for the chart visualization
const spendingData = [
	{ height: 'h-8', color: 'bg-slate-200' },
	{ height: 'h-16', color: 'bg-slate-600' },
	{ height: 'h-10', color: 'bg-slate-200' },
	{ height: 'h-20', color: 'bg-slate-800' },
	{ height: 'h-14', color: 'bg-slate-900' },
];

export default function Home() {
	const { t } = useTranslation('home');

	return (
		<div>
			<HomeHeader />
			<Hero />

			{/* Features Grid */}
			<section className="mx-auto grid w-full max-w-5xl gap-6 px-4 pb-20 md:grid-cols-2 lg:gap-8">
				{/* Easy Tracking */}
				<Card className="border-none shadow-md transition-shadow hover:shadow-lg dark:bg-slate-900">
					<CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
							<Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div className="flex flex-col">
							<CardTitle className="text-xl">
								{t('features.easyTracking.title')}
							</CardTitle>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								{t('features.easyTracking.description')}
							</p>
						</div>
					</CardHeader>
				</Card>

				{/* Recurring Bills & Subscription */}
				<Card className="border-none shadow-md transition-shadow hover:shadow-lg dark:bg-slate-900">
					<CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
							<CalendarClock className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<div className="flex flex-col">
							<CardTitle className="text-xl">
								{t('features.recurringBills.title')}
							</CardTitle>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								{t('features.recurringBills.description')}
							</p>
						</div>
					</CardHeader>
				</Card>

				{/* Shared Ledgers */}
				<Card className="border-none shadow-md transition-shadow hover:shadow-lg dark:bg-slate-900">
					<CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
							<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
						</div>
						<div className="flex flex-col">
							<CardTitle className="text-xl">
								{t('features.sharedLedgers.title')}
							</CardTitle>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								{t('features.sharedLedgers.description')}
							</p>
						</div>
					</CardHeader>
				</Card>

				{/* Apple Pay Integration */}
				<Card className="border-none shadow-md transition-shadow hover:shadow-lg dark:bg-slate-900">
					<CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
							<SmartphoneNfc className="h-6 w-6 text-slate-900 dark:text-white" />
						</div>
						<div className="flex flex-col">
							<CardTitle className="text-xl">
								{t('features.applePay.title')}
							</CardTitle>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								{t('features.applePay.description')}
							</p>
						</div>
					</CardHeader>
				</Card>

				{/* Summary */}
				<Card className="border-none shadow-md transition-shadow hover:shadow-lg md:col-span-2 dark:bg-slate-900">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base font-medium text-slate-500 dark:text-slate-400">
								{t('summary.title')}
							</CardTitle>
							<div className="bg-green-100 p-2 rounded-full dark:bg-green-900/30">
								<span className="text-green-600 font-bold dark:text-green-400">
									$
								</span>
							</div>
						</div>
						<div className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
							{t('summary.description')}
						</div>
					</CardHeader>
					<CardContent>
						<div className="mt-6 flex items-end gap-2 h-24">
							{spendingData.map((bar, index) => (
								<div
									key={index}
									className={`flex-1 rounded-t-lg ${bar.color} ${bar.height} transition-all duration-500 hover:opacity-80`}
								/>
							))}
						</div>
					</CardContent>
				</Card>
			</section>

			<footer className="mt-auto py-6 text-center text-sm text-slate-400">
				<p>
					&copy; {new Date().getFullYear()}{' '}
					{t('footer.rightsReserved')}
				</p>
			</footer>
		</div>
	);
}
