import MonthlyTab from '@/components/analytics/MonthlyTab';
import YearlyTab from '@/components/analytics/YearlyTab';
import PageTitle from '@/components/layout/PageTitle';
import LanguageSelector from '@/components/selectors/LanguageSelector';
import LedgerSelector from '@/components/selectors/LedgerSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreferencesStore } from '@/stores/usePreferences';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Summary: FC = () => {
	const { t } = useTranslation('summary');
	const ledgerId = usePreferencesStore((state) => state.ledgerId);
	const setLedgerId = usePreferencesStore((state) => state.setLedgerId);

	const [date, setDate] = useState(DateTime.now());
	const [view, setView] = useState<'monthly' | 'yearly'>('monthly');

	const handlePrev = () => {
		if (view === 'monthly') {
			setDate((prev) => prev.minus({ months: 1 }));
		} else if (view === 'yearly') {
			setDate((prev) => prev.minus({ years: 1 }));
		}
	};

	const handleNext = () => {
		if (view === 'monthly') {
			setDate((prev) => prev.plus({ months: 1 }));
		} else if (view === 'yearly') {
			setDate((prev) => prev.plus({ years: 1 }));
		}
	};

	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			<PageTitle title={t('title')} className="mb-4">
				<div className="flex gap-2">
					<LanguageSelector
						className="w-fit"
						containerClassName="w-fit"
					/>
					<LedgerSelector
						value={ledgerId ?? undefined}
						onValueChange={setLedgerId}
						className="w-fit"
						containerClassName="w-fit"
					/>
				</div>
			</PageTitle>
			<Tabs
				defaultValue="monthly"
				value={view}
				onValueChange={(v) => setView(v as 'monthly' | 'yearly')}
				className="w-full flex-1 overflow-y-auto"
			>
				<div className="flex items-center justify-between gap-4">
					<button
						onClick={handlePrev}
						className="p-2 rounded-full hover:bg-gray-100"
					>
						<ChevronLeft className="w-5 h-5" />
					</button>
					<span className="font-semibold text-lg min-w-[120px] text-center">
						{view === 'monthly'
							? date.toFormat('MMMM yyyy')
							: date.toFormat('yyyy')}
					</span>
					<button
						onClick={handleNext}
						className="p-2 rounded-full hover:bg-gray-100"
					>
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>

				<TabsList className="grid w-full grid-cols-2 mb-4">
					<TabsTrigger value="monthly">{t('monthly')}</TabsTrigger>
					<TabsTrigger value="yearly">{t('yearly')}</TabsTrigger>
				</TabsList>

				<TabsContent value="monthly">
					<MonthlyTab date={date.toJSDate()} />
				</TabsContent>

				<TabsContent value="yearly">
					<YearlyTab date={date.toJSDate()} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Summary;
