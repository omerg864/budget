import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Delete } from 'lucide-react';

interface NumericKeypadProps {
	onInput: (value: string) => void;
	onDelete: () => void;
	className?: string;
}

export function NumericKeypad({
	onInput,
	onDelete,
	className,
}: NumericKeypadProps) {
	const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

	return (
		<div className={cn('grid grid-cols-3 gap-4 p-4', className)} dir="ltr">
			{keys.map((key) => (
				<Button
					key={key}
					variant="secondary"
					size="lg"
					type="button"
					onPointerDown={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onInput(key);
					}}
					className="h-16 w-full text-3xl font-normal hover:bg-neutral-100 rounded-2xl active:scale-95 transition-transform"
				>
					{key}
				</Button>
			))}
			<Button
				variant="secondary"
				size="lg"
				type="button"
				onPointerDown={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onDelete();
				}}
				className="h-16 w-full flex items-center justify-center hover:bg-neutral-100 rounded-2xl active:scale-95 transition-transform"
			>
				<Delete className="size-8" strokeWidth={1.5} />
			</Button>
		</div>
	);
}
