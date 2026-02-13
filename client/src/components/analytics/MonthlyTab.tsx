import { DateTime } from 'luxon';
import type { FC } from 'react';
import CurrentMonthTab from './CurrentMonthTab';
import HistoricalMonthlyTab from './HistoricalMonthlyTab';

interface MonthlyTabProps {
	date: Date;
}

const MonthlyTab: FC<MonthlyTabProps> = ({ date }) => {
	const currentStart = DateTime.now().startOf('month');
	const viewStart = DateTime.fromJSDate(date).startOf('month');
	const isCurrentMonth =
		currentStart.hasSame(viewStart, 'month') &&
		currentStart.hasSame(viewStart, 'year');

	if (isCurrentMonth) {
		return <CurrentMonthTab />;
	}

	return <HistoricalMonthlyTab date={date} />;
};

export default MonthlyTab;
