import { getIcon } from '@/services/ledger.service';
import type { SupportedIcons } from '@shared/constants/ledger.constants';

export type LedgerIconProps = {
	icon: SupportedIcons;
	color: string;
};

const LedgerIcon = ({ icon, color }: LedgerIconProps) => {
	const Icon = getIcon(icon);

	if (!Icon) return null;

	return (
		<div
			className="p-1.5 rounded-full"
			style={{
				backgroundColor: `${color}20`,
				color: color,
			}}
		>
			<Icon className="w-4 h-4" />
		</div>
	);
};

export default LedgerIcon;
