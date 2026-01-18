import { DateTime } from 'luxon';

export function toLuxonDate(date: Date | string | number | undefined) {
	if (!date) {
		return undefined;
	}
	return DateTime.fromJSDate(new Date(date));
}
