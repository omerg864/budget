import { cn } from '@/lib/utils';
import { useClickAway } from 'ahooks';
import { Trash } from 'lucide-react';
import { useRef, useState, type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../custom/BackButton';
import { Button } from '../ui/button';

export type FormTitleProps = {
	title: ReactNode;
	backButton?: boolean;
	onBack?: () => void;
	deleteButton?: boolean;
	onDelete?: () => void;
	disabled?: boolean;
};

const FormTitle: FC<FormTitleProps> = ({
	title,
	backButton,
	onBack,
	deleteButton,
	onDelete,
	disabled,
}: FormTitleProps) => {
	const { t } = useTranslation('generic');
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const deleteContainerRef = useRef<HTMLDivElement>(null);

	useClickAway(() => {
		setShowDeleteConfirm(false);
	}, deleteContainerRef);

	return (
		<div className="grid grid-cols-3 items-center gap-2">
			{backButton ? (
				<BackButton
					onClick={onBack}
					disabled={disabled}
					className="w-9 h-9"
				/>
			) : (
				<div></div>
			)}
			<span className={cn('text-center')}>{title}</span>
			{deleteButton ? (
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
			) : (
				<div></div>
			)}
		</div>
	);
};

export default FormTitle;
