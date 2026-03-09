import { useDir } from '@/hooks/useDir';
import { getTransactionTypeIcon } from '@/services/transaction.service';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import type { AnyFormType } from '@/types/form.type.ts';
import { type TransactionPaymentType } from '@shared/constants/transaction.constants.ts';
import type { TransactionEntity } from '@shared/types/transaction.type.ts';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useReducer, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericKeypad } from '../custom/NumericKeypad.tsx';
import FormErrors from '../form/FormErrors.tsx';
import FormSelectInput from '../form/FormSelectInput.tsx';
import CurrencyFormatter from '../formatters/CurrencyFormatter.tsx';
import TransactionTypeFormatter from '../formatters/TransactionTypeFormatter';
import CurrencySelector from '../selectors/CurrencySelector';
import PaymentSelector from '../selectors/PaymentSelector.tsx';
import { Card } from '../ui/card';
import { Tabs } from '../ui/tabs.tsx';
import TransactionTypeTabs from './TransactionTypeTabs';

export type TransactionFormBaseDataProps = {
	form: AnyFormType;
	transactionToEdit?: TransactionEntity | null;
};

function keypadReducer(
	state: string,
	payload: { type: 'delete' | 'type' | 'clear'; value?: string },
): string {
	switch (payload.type) {
		case 'type': {
			const dotIndex = state.indexOf('.');
			if (dotIndex !== -1 && payload.value === '.') return state;
			if (dotIndex !== -1 && state.length - dotIndex > 2) return state;
			if (state.length > 10) return state;
			if (state === '0' && payload.value !== '.') {
				return payload.value!;
			} else {
				return state + payload.value!;
			}
		}
		case 'delete': {
			const sliced = state.slice(0, -1);
			const newValue = sliced === '' ? '0' : sliced;
			return newValue;
		}
		case 'clear':
			return '';
		default:
			return state;
	}
}

const TransactionFormBaseData: FC<TransactionFormBaseDataProps> = ({
	form,
	transactionToEdit,
}: TransactionFormBaseDataProps) => {
	const { t } = useTranslation('transactions');
	const dir = useDir();
	const { ledgerId } = usePreferencesStore();

	const [input, dispatch] = useReducer(
		keypadReducer,
		transactionToEdit
			? String(transactionToEdit.amount)
			: String(form.getFieldValue('amount') ?? 0),
	);

	const onInput = useMemoizedFn((value: string) => {
		dispatch({
			type: 'type',
			value,
		});
	});

	const onDelete = useMemoizedFn(() => {
		dispatch({
			type: 'delete',
		});
	});

	const onPaymentChange = useMemoizedFn(
		(id: string, type: TransactionPaymentType) => {
			form.setFieldValue('paymentId', id);
			form.setFieldValue('paymentType', type);
		},
	);

	useEffect(() => {
		form.setFieldValue('amount', Number(input));
	}, [input, form]);

	return (
		<Tabs defaultValue={transactionToEdit?.type ?? 'expense'} dir={dir}>
			<div className="flex flex-col gap-4 items-center w-full">
				{transactionToEdit ? (
					<form.Field
						name="type"
						children={(field) => (
							<Card className="w-full flex flex-row gap-2 p-2 items-center">
								{getTransactionTypeIcon(field.state.value)}
								<TransactionTypeFormatter
									value={field.state.value}
								/>
							</Card>
						)}
					/>
				) : (
					<TransactionTypeTabs
						onChange={(type) => form.setFieldValue('type', type)}
					/>
				)}
				<div className="w-full h-full flex flex-col justify-between">
					<div>
						<div className="grid grid-cols-2 gap-2">
							<form.Subscribe
								selector={(s) => s.values.paymentType}
							>
								{(paymentType) => (
									<form.Field
										name="paymentId"
										children={(field) => (
											<FormSelectInput
												field={field}
												label={t('paymentMethod')}
												required
											>
												<PaymentSelector
													ledgerId={
														ledgerId ?? undefined
													}
													value={field.state.value}
													valueType={paymentType}
													onValueChange={
														onPaymentChange
													}
												/>
											</FormSelectInput>
										)}
									/>
								)}
							</form.Subscribe>

							<form.Field
								name="currency"
								children={(field) => (
									<FormSelectInput
										field={field}
										label={t('currency')}
										required
									>
										<CurrencySelector
											value={field.state.value}
											onValueChange={field.handleChange}
										/>
									</FormSelectInput>
								)}
							/>
						</div>

						<form.Field
							name="amount"
							children={(field) => (
								<form.Subscribe
									selector={(state) => state.values.currency}
								>
									{(currency) => (
										<CurrencyFormatter
											amount={field.state.value}
											currency={currency}
											className="text-4xl font-bold my-4 block text-center"
										/>
									)}
								</form.Subscribe>
							)}
						/>
					</div>
					<div>
						<FormErrors form={form} path={['amount']} />
						<NumericKeypad onInput={onInput} onDelete={onDelete} />
					</div>
				</div>
			</div>
		</Tabs>
	);
};

export default TransactionFormBaseData;
