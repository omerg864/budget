import { ChevronRight } from 'lucide-react';
import type { FC } from 'react';

export type SettingsItemProps = {
	icon: any;
	title: string;
	subtitle?: string;
	onClick?: () => void;
};

const SettingsItem: FC<SettingsItemProps> = ({
	icon: Icon,
	title,
	subtitle,
	onClick,
}) => (
	<div
		className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm mb-3 cursor-pointer active:scale-[0.98] transition-transform"
		onClick={onClick}
	>
		<div className="flex items-center gap-4">
			<div className="p-2.5 bg-slate-100 rounded-full text-slate-900">
				<Icon size={20} />
			</div>
			<div>
				<h3 className="font-semibold text-gray-900">{title}</h3>
				{subtitle && (
					<p className="text-sm text-gray-500">{subtitle}</p>
				)}
			</div>
		</div>
		<ChevronRight className="text-gray-400" size={20} />
	</div>
);

export default SettingsItem;
