import { Calendar } from '@/components/ui/calendar';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { format } from 'date-fns';
import type { FC } from 'react';
import { useState } from 'react';
import TransactionList from './TransactionList';

interface TransactionCalendarProps {
	transactions: TransactionEntity[];
	onCardClick: (transaction: TransactionEntity) => void;
	month: Date;
}

const TransactionCalendar: FC<TransactionCalendarProps> = ({
	transactions,
	onCardClick,
	month,
}) => {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const datesWithTransactions = transactions.map((t) => new Date(t.date));

	const handleDateSelect = (newDate: Date | undefined) => {
		setDate(newDate);
		if (newDate) {
			const dateKey = format(newDate, 'yyyy-MM-dd');
			const element = document.getElementById(`date-${dateKey}`);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-center bg-white rounded-lg shadow-sm sticky top-0 z-10">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleDateSelect}
					month={month}
					disableNavigation
					hideNavigation
					formatters={{
						formatCaption: () => '',
					}}
					className="rounded-md border-0 w-full"
					modifiers={{
						hasTransaction: datesWithTransactions,
					}}
					modifiersClassNames={{
						hasTransaction:
							"relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full",
					}}
				/>
			</div>

			<div className="space-y-3">
				<TransactionList
					transactions={transactions}
					onCardClick={onCardClick}
				/>
			</div>
		</div>
	);
};

export default TransactionCalendar;
