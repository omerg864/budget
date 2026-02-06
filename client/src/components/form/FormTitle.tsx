import { cn } from '@/lib/utils';
import { type FC, type ReactNode } from 'react';
import BackButton from '../custom/BackButton';
import DeleteButton from '../custom/DeleteButton';

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
			{deleteButton && onDelete ? (
				<DeleteButton onDelete={onDelete} disabled={disabled} />
			) : (
				<div></div>
			)}
		</div>
	);
};

export default FormTitle;
