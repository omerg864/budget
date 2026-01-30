import { useAccountsQuery } from '@/api/account.api.ts';
import { useCreditsQuery } from '@/api/credit.api.ts';
import { AccountType } from '@shared/constants/account.constants.ts';
import type { AccountEntity } from '@shared/types/account.type.ts';
import type { CreditEntity } from '@shared/types/credit.type.ts';
import type { TransactionEntity } from '@shared/types/transaction.type';
import { useMemoizedFn } from 'ahooks';
import { useMemo, type FC } from 'react';
import type { BaseSelectorProps } from './BaseSelector.tsx';
import BaseSelector from './BaseSelector.tsx';
import { TransactionPaymentType } from '@shared/constants/transaction.constants.ts';

export type PaymentSelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'value' | 'onValueChange'
> & {
	ledgerId: string | undefined;
	value: TransactionEntity['paymentId'] | undefined;
	valueType: TransactionEntity['paymentType'];
	onValueChange: (
		value: TransactionEntity['paymentId'],
		type: TransactionEntity['paymentType'],
	) => void;
	filter?: (option: AccountEntity | CreditEntity) => boolean;
};

type PaymentValue =
	`${TransactionEntity['paymentType']}:${TransactionEntity['paymentId']}`;

function createValue(
	value: TransactionEntity['paymentId'],
	type: TransactionEntity['paymentType'],
): PaymentValue {
	return `${type}:${value}`;
}

function parseValue(value: PaymentValue) {
	const [type, id] = value.split(':');
	return { type: type as TransactionEntity['paymentType'], id };
}

const PaymentSelector: FC<PaymentSelectorProps> = ({
	ledgerId,
	value,
	valueType,
	onValueChange,
	filter,
	...props
}: PaymentSelectorProps) => {
	const { data: accounts } = useAccountsQuery(ledgerId);
	const { data: credits } = useCreditsQuery(ledgerId);

	const options = useMemo(() => {
		return [
			...(accounts || [])
				.filter((account) => {
					if (account.type !== AccountType.CASH) {
						return false;
					}
					if (filter) {
						return filter(account);
					}
					return true;
				})
				.map((account) => ({
					value: createValue(
						account.id,
						TransactionPaymentType.ACCOUNT,
					),
					label: account.name,
				})),
			...(credits || [])
				.filter(filter ? filter : () => true)
				.map((credit) => ({
					value: createValue(
						credit.id,
						TransactionPaymentType.CREDIT,
					),
					label: credit.name,
				})),
		];
	}, [accounts, credits, filter]);

	const onChange = useMemoizedFn((value: string) => {
		if (!value) {
			onValueChange('', TransactionPaymentType.ACCOUNT);
			return;
		}
		const { type, id } = parseValue(value as PaymentValue);
		onValueChange(id, type);
	});

	const currentValue = useMemo(() => {
		if (!value) return undefined;
		return createValue(value, valueType);
	}, [value, valueType]);

	return (
		<BaseSelector
			value={currentValue}
			onValueChange={onChange}
			options={options}
			{...props}
		/>
	);
};

export default PaymentSelector;
