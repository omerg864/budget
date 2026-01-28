import { Button } from '@/components/ui/button';
import { getNavItems, getSecondaryNavItems } from '@/constants/nav.constants';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

export default function SideNav() {
	const { t } = useTranslation('nav');

	const navItems = getNavItems(t);
	const secondaryNavItems = getSecondaryNavItems(t);

	return (
		<div className="fixed bottom-4 top-4 left-4 z-50 flex w-20 flex-col items-center justify-between rounded-2xl bg-[#1c1c1e]/90 py-6 text-white shadow-2xl backdrop-blur-xl transition-all">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								cn(
									'group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10',
									isActive &&
										'bg-white text-black hover:bg-white',
								)
							}
						>
							<item.icon className="h-5 w-5" />
						</NavLink>
					))}
				</div>

				<div className="h-px w-8 bg-white/10" />

				<Button
					size="icon"
					className="h-10 w-10 rounded-xl bg-white text-black shadow-lg hover:bg-white/90"
				>
					<Plus className="h-5 w-5" />
				</Button>
			</div>

			<div className="flex flex-col gap-2">
				{secondaryNavItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							cn(
								'group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10',
								isActive &&
									'bg-white text-black hover:bg-white',
							)
						}
					>
						<item.icon className="h-5 w-5" />
					</NavLink>
				))}
			</div>
		</div>
	);
}
