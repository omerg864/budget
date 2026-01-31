import { useBreakpoint } from '@/hooks/useBreakpoint';
import type { AnyFormType } from '@/types/form.type.ts';
import { useMemoizedFn } from 'ahooks';
import type { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { DrawerClose } from '../ui/drawer';

export type TransactionFormButtonsProps = PropsWithChildren & {
	form: AnyFormType;
	onCancel: () => void;
	submitTitle: string;
	cancelTitle: string;
	disabled?: boolean;
	next: boolean;
	isLoading: boolean;
	onNext: () => void;
};

const TransactionFormButtons: FC<TransactionFormButtonsProps> = ({
	onCancel,
	submitTitle,
	cancelTitle,
	disabled,
	next,
	onNext,
	form,
	children,
}: TransactionFormButtonsProps) => {
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
							<>
								{children}
								<Button
									type="button"
									onClick={onNextClick}
									disabled={disabled}
								>
									{t('next')}
								</Button>
							</>
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
						<>
							{children}
							<Button
								type="button"
								onClick={onNextClick}
								disabled={disabled}
								className="w-full"
							>
								{t('next')}
							</Button>
						</>
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
					<Button
						type="submit"
						form="transaction-form"
						disabled={disabled}
					>
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
				form="transaction-form"
				disabled={disabled}
				className="w-full"
			>
				{submitTitle}
			</Button>
			<DrawerClose asChild>
				<Button
					variant="outline"
					disabled={disabled}
					className="w-full"
				>
					{cancelTitle}
				</Button>
			</DrawerClose>
		</div>
	);
};

export default TransactionFormButtons;
