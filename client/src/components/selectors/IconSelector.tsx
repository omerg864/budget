import LedgerIcon from '@/components/ledger/LedgerIcon';
import { SupportedIcons } from '@shared/constants/ledger.constants';
import { useMemoizedFn } from 'ahooks';
import { useMemo, type FC } from 'react';
import SupportedIconsFormatter from '../formatters/SupportedIconsFormatter.tsx';
import BaseSelector, { type BaseSelectorProps } from './BaseSelector';

export type IconSelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'onValueChange'
> & {
	onValueChange: (value: SupportedIcons) => void;
};

const IconSelector: FC<IconSelectorProps> = ({ onValueChange, ...props }) => {
	const iconOptions = useMemo(
		() =>
			Object.values(SupportedIcons).map((icon) => ({
				value: icon,
				label: (
					<div className="flex items-center gap-2">
						<LedgerIcon icon={icon} color="#000000" />
						<SupportedIconsFormatter value={icon} />
					</div>
				),
			})),
		[],
	);

	const onChange = useMemoizedFn((value: string) => {
		onValueChange(value as SupportedIcons);
	});

	return (
		<BaseSelector
			{...props}
			options={iconOptions}
			onValueChange={onChange}
		/>
	);
};

export default IconSelector;
