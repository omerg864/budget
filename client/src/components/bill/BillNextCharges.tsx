import { getNextChargeDates } from '@shared/services/transaction.shared-service';
import type { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type';
import { DateTime } from 'luxon';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';

export type BillNextChargesProps = {
	bill: RecurringTransactionEntity;
};

const BillNextCharges: FC<BillNextChargesProps> = ({
	bill,
}: BillNextChargesProps) => {
	const { t } = useTranslation('transactions');
	const nextCharges = useMemo(() => {
		return getNextChargeDates(bill);
	}, [bill]);

	if (nextCharges.length === 0) return null;

	return (
		<div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
			<span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
				{t('nextCharges')}
			</span>
			<div className="flex gap-2 flex-wrap">
				{nextCharges.map((date) => (
					<div
						key={date.toISOString()}
						className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-xs font-semibold"
					>
						{DateTime.fromJSDate(date).toFormat('dd MMM yyyy')}
					</div>
				))}
			</div>
		</div>
	);
};

export default BillNextCharges;
