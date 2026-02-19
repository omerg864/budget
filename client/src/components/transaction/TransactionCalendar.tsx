import { useLedgerQuery } from '@/api/ledger.api';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import { usePreferencesStore } from '@/stores/usePreferences';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { DayButtonProps } from 'react-day-picker';

interface TransactionCalendarProps {
	transactions: TransactionEntity[];
	onDateSelect: (date: Date | undefined) => void;
	month: Date;
	onMonthChange: (date: Date) => void;
	className?: string;
}

const TransactionCalendar: FC<TransactionCalendarProps> = ({
	transactions,
	onDateSelect,
	month,
	onMonthChange,
	className,
}) => {
	const { ledgerId } = usePreferencesStore();
	const { data: ledger } = useLedgerQuery(ledgerId ?? undefined);

	const transactionsByDate = useMemo(() => {
		const map = new Map<string, TransactionEntity[]>();
		transactions.forEach((t) => {
			const dateKey = DateTime.fromJSDate(new Date(t.date)).toFormat(
				'yyyy-MM-dd',
			);
			const current = map.get(dateKey) || [];
			current.push(t);
			map.set(dateKey, current);
		});
		return map;
	}, [transactions]);

	const CustomDayButton = (props: DayButtonProps) => {
		const { day } = props;
		const dateKey = DateTime.fromJSDate(day.date).toFormat('yyyy-MM-dd');
		const dayTransactions = transactionsByDate.get(dateKey);

		let categoryColor = 'var(--primary)'; // Default color
		if (dayTransactions && dayTransactions.length > 0 && ledger) {
			const firstTransaction = dayTransactions[0];
			const category = ledger.categories.find(
				(c) => c.id === firstTransaction.category,
			);
			if (category?.color) {
				categoryColor = category.color;
			}
		}

		return (
			<div className="relative">
				<CalendarDayButton {...props} />
				{dayTransactions && dayTransactions.length > 0 && (
					<div
						className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full z-20 pointer-events-none"
						style={{ backgroundColor: categoryColor }}
					/>
				)}
			</div>
		);
	};

	return (
		<Calendar
			className={className}
			mode="single"
			selected={month}
			onSelect={onDateSelect}
			month={month}
			onMonthChange={onMonthChange}
			disableNavigation
			hideNavigation
			required
			components={{
				DayButton: CustomDayButton,
			}}
		/>
	);
};

export default TransactionCalendar;
