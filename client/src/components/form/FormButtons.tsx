import { useBreakpoint } from '@/hooks/useBreakpoint';
import type { AnyFormType } from '@/types/form.type.ts';
import { useMemoizedFn } from 'ahooks';
import { type FC, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DrawerClose } from '../ui/drawer';
import FormErrors from './FormErrors';

export type FormButtonsProps = PropsWithChildren & {
	form: AnyFormType;
	formName: string;
	onCancel: () => void;
	submitTitle: string;
	cancelTitle: string;
	disabled?: boolean;
	next?: boolean;
	validateNext?: (values: any) => boolean;
	onNext?: () => void;
};

const FormButtons: FC<FormButtonsProps> = ({
	onCancel,
	submitTitle,
	cancelTitle,
	disabled = false,
	next = false,
	validateNext,
	onNext,
	form,
	formName,
	children,
}: FormButtonsProps) => {
	const { t } = useTranslation('generic');
	const { isLargerThan } = useBreakpoint();
	const isLargerThanMd = isLargerThan('md');

	const onNextClick = useMemoizedFn(() => {
		if (validateNext && !validateNext(form.state.values)) {
			form.validate('submit');
		} else {
			onNext?.();
		}
	});

	if (next) {
		if (isLargerThanMd)
			return (
				<form.Subscribe selector={(state) => state.values}>
					{() => {
						return (
							<div className="mb-2">
								{children}
								<FormErrors form={form} path={[]} />
								<Button
									type="button"
									onClick={onNextClick}
									disabled={disabled}
								>
									{t('next')}
								</Button>
							</div>
						);
					}}
				</form.Subscribe>
			);

		return (
			<form.Subscribe selector={(state) => state.values}>
				{() => {
					return (
						<div className="mb-2">
							{children}
							<FormErrors form={form} path={[]} />
							<Button
								type="button"
								onClick={onNextClick}
								disabled={disabled}
								className="w-full"
							>
								{t('next')}
							</Button>
						</div>
					);
				}}
			</form.Subscribe>
		);
	}

	// Desktop view
	if (isLargerThanMd)
		return (
			<>
				{children}
				<FormErrors form={form} path={[]} />
				<div className="flex w-full justify-end gap-2">
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={disabled}
					>
						{cancelTitle}
					</Button>
					<Button type="submit" form={formName} disabled={disabled}>
						{submitTitle}
					</Button>
				</div>
			</>
		);

	// Mobile view
	return (
		<div className="flex w-full flex-col gap-2">
			{children}
			<FormErrors form={form} path={[]} />
			<Button
				type="submit"
				form={formName}
				disabled={disabled}
				className="w-full"
			>
				{submitTitle}
			</Button>
			<DrawerClose asChild>
				<Button
					variant="outline"
					onClick={onCancel}
					disabled={disabled}
					className="w-full"
				>
					{cancelTitle}
				</Button>
			</DrawerClose>
		</div>
	);
};

export default FormButtons;
