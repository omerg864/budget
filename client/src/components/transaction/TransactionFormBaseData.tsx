import { useUserQuery } from '@/api/user.api.ts';
import type { AnyFormType } from '@/types/form.type.ts';
import type { TransactionPaymentType } from '@shared/constants/transaction.constants.ts';
import type { TransactionEntity } from '@shared/types/transaction.type.ts';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useReducer, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericKeypad } from '../custom/NumericKeypad.tsx';
import FormErrors from '../form/FormErrors.tsx';
import FormSelectInput from '../form/FormSelectInput.tsx';
import CurrencyFormatter from '../formatters/CurrencyFormatter.tsx';
import PaymentSelector from '../selectors/PaymentSelector.tsx';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs.tsx';

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
	const { data: user } = useUserQuery();
	const ledgerId = user?.defaultLedgerId;

	const [input, dispatch] = useReducer(
		keypadReducer,
		transactionToEdit ? String(transactionToEdit.amount) : '0',
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
		<Tabs defaultValue="expense">
			<div className="flex flex-col gap-4 items-center w-full">
				<TabsList className="w-full">
					<TabsTrigger value="expense">Expense</TabsTrigger>
					<TabsTrigger value="income">Income</TabsTrigger>
					<TabsTrigger value="transfer">Transfer</TabsTrigger>
				</TabsList>
				<div className="w-full h-full flex flex-col justify-between">
					<div>
						<form.Field
							name="paymentId"
							children={(field) => (
								<FormSelectInput
									field={field}
									label={t('paymentMethod')}
								>
									<PaymentSelector
										ledgerId={ledgerId}
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

export default TransactionFormBaseData;
