import { DateTime } from 'luxon';
import { TransactionRecurringFrequency } from '../constants/transaction.constants.js';
import { RecurringTransactionEntity } from '../types/recurringTransaction.type.js';
import { toLuxonDate } from '../utils/luxon.utils.js';

const FREQUENCY_RECURRENCE_MAP: Record<
	TransactionRecurringFrequency,
	{ unit: 'days' | 'weeks' | 'months' | 'years'; factor: number }
> = {
	[TransactionRecurringFrequency.DAILY]: { unit: 'days', factor: 1 },
	[TransactionRecurringFrequency.WEEKLY]: { unit: 'weeks', factor: 1 },
	[TransactionRecurringFrequency.BI_WEEKLY]: { unit: 'weeks', factor: 2 },
	[TransactionRecurringFrequency.MONTHLY]: { unit: 'months', factor: 1 },
	[TransactionRecurringFrequency.QUARTERLY]: { unit: 'months', factor: 3 },
	[TransactionRecurringFrequency.SEMI_ANNUALLY]: {
		unit: 'months',
		factor: 6,
	},
	[TransactionRecurringFrequency.YEARLY]: { unit: 'years', factor: 1 },
};

export function getNextChargeDates(
	recurringTransaction: RecurringTransactionEntity,
	limit = 5,
): Date[] {
	const dates: Date[] = [];
	const { frequency, startDate, endDate } = recurringTransaction;
	let current = toLuxonDate(startDate);
	const endDateTime = toLuxonDate(endDate);

	if (!current) {
		return [];
	}

	const today = DateTime.now().startOf('day');

	// If the recurring transaction has an end date and it's in the past, return empty
	if (endDateTime && endDateTime < today) {
		return [];
	}

	const { unit, factor } = FREQUENCY_RECURRENCE_MAP[frequency];
	const duration = { [unit]: factor };

	// Optimization: Jump to the next applicable date if current is far in the past
	if (current < today) {
		const diff = today.diff(current, unit).as(unit);
		const intervals = Math.ceil(diff / factor);
		if (intervals > 0) {
			current = current.plus({ [unit]: intervals * factor });
		}
	}

	// Advance current date until it's today or in the future
	// This is a safety loop for edge cases or float imprecision
	while (current < today) {
		current = current.plus(duration);
	}

	// Collect the next dates
	while (dates.length < limit) {
		if (endDateTime && current > endDateTime) {
			break;
		}
		dates.push(current.toJSDate());
		current = current.plus(duration);
	}

	return dates;
}

export function getThisMonthChargeDates(
	recurringTransaction: RecurringTransactionEntity,
	monthDate: Date,
): Date[] {
	const dates: Date[] = [];
	const { frequency, startDate, endDate } = recurringTransaction;
	let current = toLuxonDate(startDate);
	const endDateTime = toLuxonDate(endDate);
	const targetMonth = toLuxonDate(monthDate);

	if (!current || !targetMonth) {
		return [];
	}

	const startOfMonth = targetMonth.startOf('month');
	const endOfMonth = targetMonth.endOf('month');

	// If the transaction starts after this month, return empty
	if (current > endOfMonth) {
		return [];
	}

	const { unit, factor } = FREQUENCY_RECURRENCE_MAP[frequency];
	const duration = { [unit]: factor };

	// Optimization: Jump to start of month
	if (current < startOfMonth) {
		const diff = startOfMonth.diff(current, unit).as(unit);
		const intervals = Math.ceil(diff / factor);
		if (intervals > 0) {
			current = current.plus({ [unit]: intervals * factor });
		}
	}

	// Advance until we reach at least the start of the target month
	// Note: We check < startOfMonth.
	// However, simply iterating could be slow if diff is huge (e.g. daily for 10 years).
	// But for this task, I will stick to the robust loop.
	while (current < startOfMonth) {
		current = current.plus(duration);
	}

	// formatting note: current is now >= startOfMonth.
	// Check if we are still within the month.
	while (current <= endOfMonth) {
		if (endDateTime && current > endDateTime) {
			break;
		}
		dates.push(current.toJSDate());
		current = current.plus(duration);
	}

	return dates;
}

export function convertCurrency(
	amount: number,
	conversionRate: number = 1,
): number {
	return amount * conversionRate;
}
