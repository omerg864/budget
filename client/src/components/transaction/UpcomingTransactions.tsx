import { useRecurringTransactionsQuery } from '@/api/recurring-transaction.api';
import { Loader } from '@/components/custom/Loader';
import TransactionList from '@/components/transaction/TransactionList';
import { usePreferencesStore } from '@/stores/usePreferences';
import { getThisMonthChargeDates } from '@shared/services/transaction.shared-service';
import type { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { DateTime } from 'luxon';
import { useMemo, type FC } from 'react';

type UpcomingTransactionsProps = {
	month: Date;
};

const UpcomingTransactions: FC<UpcomingTransactionsProps> = ({ month }) => {
	const { ledgerId } = usePreferencesStore();
	const { data: recurringTransactions = [], isLoading } =
		useRecurringTransactionsQuery(ledgerId || '');

	const upcomingTransactions = useMemo(() => {
		const transactions: TransactionEntity[] = [];

		recurringTransactions.forEach((bill: RecurringTransactionEntity) => {
			// Get occurrences for the specific month
			const monthDates = getThisMonthChargeDates(bill, month);

			monthDates.forEach((date: Date) => {
				const today = DateTime.now().endOf('day');
				if (DateTime.fromJSDate(date) <= today) return;
				transactions.push({
					id: `${bill.id}-${date.toISOString()}`,
					description: bill.description,
					amount: bill.amount,
					currency: bill.currency,
					date: date,
					type: bill.type,
					category: bill.category,
					paymentId: bill.paymentId,
					paymentType: bill.paymentType,
					ledgerId: bill.ledgerId,
					createdAt: bill.createdAt,
					updatedAt: bill.updatedAt,
					recurringTransactionId: bill.id,
				});
			});
		});

		// Sort by date ascending
		return transactions.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		);
	}, [recurringTransactions, month]);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<TransactionList
			transactions={upcomingTransactions}
			onCardClick={() => {}}
		/>
	);
};

export default UpcomingTransactions;
