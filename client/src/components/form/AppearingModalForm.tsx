import type { AnyFormType } from '@/types/form.type';
import type { FC, ReactNode } from 'react';
import type { AppearingModalProps } from '../custom/AppearingModal';
import AppearingModal from '../custom/AppearingModal';
import FormButtons, { type FormButtonsProps } from './FormButtons';
import type { FormTitleProps } from './FormTitle';
import FormTitle from './FormTitle';

export type AppearingModalFormProps = Omit<
	AppearingModalProps,
	'title' | 'footer'
> &
	FormTitleProps &
	FormButtonsProps & {
		form: AnyFormType;
		formName: string;
		formClassName?: string;
		footerChildren?: ReactNode;
	};

const AppearingModalForm: FC<AppearingModalFormProps> = ({
	form,
	formName,
	children,
	footerChildren,
	formClassName,
	...props
}: AppearingModalFormProps) => {
	return (
		<AppearingModal
			{...props}
			title={<FormTitle {...props} />}
			footer={
				<FormButtons form={form} formName={formName} {...props}>
					{footerChildren}
				</FormButtons>
			}
		>
			<form
				className={formClassName}
				id={formName}
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				{children}
			</form>
		</AppearingModal>
	);
};

export default AppearingModalForm;
