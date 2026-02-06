import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

interface DatePickerProps {
	date: Date | undefined;
	setDate: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
}

export function DatePicker({
	date,
	setDate,
	placeholder,
	className,
}: DatePickerProps) {
	const { t } = useTranslation('generic');
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal',
						!date && 'text-muted-foreground',
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? (
						DateTime.fromJSDate(date).toLocaleString(
							DateTime.DATE_MED,
						)
					) : (
						<span>{placeholder || t('pickDate')}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="single" selected={date} onSelect={setDate} />
			</PopoverContent>
		</Popover>
	);
}
