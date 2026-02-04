import { useBreakpoint } from '@/hooks/useBreakpoint.ts';
import type { AnyFormType } from '@/types/form.type.ts';
import { useMemoizedFn } from 'ahooks';
import type { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button.tsx';
import { DrawerClose } from '../ui/drawer.tsx';

export type BillFormButtonsProps = PropsWithChildren & {
	form: AnyFormType;
	onCancel: () => void;
	submitTitle: string;
	cancelTitle: string;
	disabled?: boolean;
	next: boolean;
	isLoading: boolean;
	onNext: () => void;
};

const BillFormButtons: FC<BillFormButtonsProps> = ({
	onCancel,
	submitTitle,
	cancelTitle,
	disabled,
	next,
	onNext,
	form,
	children,
}: BillFormButtonsProps) => {
	const { t } = useTranslation('generic');
	const { isLargerThan } = useBreakpoint();
	const isLargerThanMd = isLargerThan('md');

	const onNextClick = useMemoizedFn(() => {
		if (!form.state.values.paymentId || !form.state.values.amount) {
			form.validate('submit');
		} else {
			onNext();
		}
	});

	if (next) {
		if (isLargerThanMd)
			return (
				<form.Subscribe
					selector={(state) => ({
						paymentId: state.values.paymentId,
						amount: state.values.amount,
					})}
				>
					{() => {
						return (
							<div className="mb-2">
								{children}
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
			<form.Subscribe
				selector={(state) => ({
					paymentId: state.values.paymentId,
					amount: state.values.amount,
				})}
			>
				{() => {
					return (
						<div className="mb-2">
							{children}
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
				<div className="flex w-full justify-end gap-2">
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={disabled}
					>
						{cancelTitle}
					</Button>
					<Button type="submit" form="bill-form" disabled={disabled}>
						{submitTitle}
					</Button>
				</div>
			</>
		);

	// Mobile view
	return (
		<div className="flex w-full flex-col gap-2">
			{children}
			<Button
				type="submit"
				form="bill-form"
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

export default BillFormButtons;
