import { cn } from '@/lib/utils';
import { useClickAway } from 'ahooks';
import { Trash } from 'lucide-react';
import { useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export type DeleteButtonProps = {
	onDelete: () => void;
	disabled?: boolean;
	confirmTitle?: string;
};

const DeleteButton: FC<DeleteButtonProps> = ({
	onDelete,
	disabled,
}: DeleteButtonProps) => {
	const { t } = useTranslation('generic');
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
	const deleteContainerRef = useRef<HTMLDivElement>(null);

	useClickAway(() => {
		setShowDeleteConfirm(false);
	}, deleteContainerRef);

	return (
		<div ref={deleteContainerRef} className={cn('text-end')}>
			{showDeleteConfirm ? (
				<Button
					variant="destructive"
					onClick={onDelete}
					disabled={disabled}
					type="button"
				>
					{t('confirmDelete')}
				</Button>
			) : (
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setShowDeleteConfirm(true)}
					disabled={disabled}
					type="button"
					className="text-muted-foreground hover:text-destructive"
				>
					<Trash />
				</Button>
			)}
		</div>
	);
};

export default DeleteButton;
