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
			className="p-2 rounded-full"
			style={{
				backgroundColor: `${color}1A`,
			}}
		>
			<Icon className="w-5 h-5" style={{ color: color }} />
		</div>
	);
};

export default LedgerIcon;
