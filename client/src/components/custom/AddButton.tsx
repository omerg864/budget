import { Plus } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '../ui/button.tsx';

export type AddButtonProps = {
	onAdd?: () => void;
};

const AddButton: FC<AddButtonProps> = ({ onAdd }: AddButtonProps) => {
	return (
		<Button
			size="icon"
			className="h-10 w-10 rounded-full bg-slate-100 text-black hover:bg-slate-200 dark:bg-slate-800 dark:text-white"
			onClick={onAdd}
		>
			<Plus className="h-5 w-5" />
		</Button>
	);
};

export default AddButton;
