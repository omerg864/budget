import { getTransactionTypeIcon } from '@/services/transaction.service';
import { usePreferencesStore } from '@/stores/usePreferences';
import type { AnyFormType } from '@/types/form.type';
import type { TransactionPaymentType } from '@shared/constants/transaction.constants';
import type { RecurringTransactionEntity } from '@shared/types/recurringTransaction.type';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useReducer, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericKeypad } from '../custom/NumericKeypad';
import FormErrors from '../form/FormErrors';
import FormSelectInput from '../form/FormSelectInput';
import CurrencyFormatter from '../formatters/CurrencyFormatter';
import TransactionTypeFormatter from '../formatters/TransactionTypeFormatter';
import PaymentSelector from '../selectors/PaymentSelector';
import TransactionTypeTabs from '../transaction/TransactionTypeTabs';
import { Card } from '../ui/card';
import { Tabs } from '../ui/tabs';

export type BillFormBaseDataProps = {
	form: AnyFormType;
	billToEdit?: RecurringTransactionEntity | null;
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

const BillFormBaseData: FC<BillFormBaseDataProps> = ({
	form,
	billToEdit,
}: BillFormBaseDataProps) => {
	const { t } = useTranslation('transactions');
	const { ledgerId } = usePreferencesStore();

	const [input, dispatch] = useReducer(
		keypadReducer,
		billToEdit ? String(billToEdit.amount) : '0',
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
		<Tabs defaultValue={billToEdit?.type ?? 'expense'}>
			<div className="flex flex-col gap-4 items-center w-full">
				{billToEdit ? (
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
						<form.Field
							name="paymentId"
							children={(field) => (
								<FormSelectInput
									field={field}
									label={t('paymentMethod')}
									required
								>
									<PaymentSelector
										ledgerId={ledgerId ?? undefined}
										value={field.state.value}
										valueType={form.getFieldValue(
											'paymentType',
										)}
										onValueChange={onPaymentChange}
									/>
								</FormSelectInput>
							)}
						/>

						<form.Field
							name="amount"
							children={(field) => (
								<CurrencyFormatter
									amount={field.state.value}
									currency={form.getFieldValue('currency')}
									className="text-4xl font-bold my-4 block text-center"
								/>
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

export default BillFormBaseData;
