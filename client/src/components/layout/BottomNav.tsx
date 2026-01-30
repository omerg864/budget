import { Button } from '@/components/ui/button';
import { getNavItems, getSecondaryNavItems } from '@/constants/nav.constants';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { TransactionForm } from '../transaction/TransactionForm';

export default function BottomNav() {
	const { t } = useTranslation('nav');
	const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

	const navItems = getNavItems(t);
	const secondaryNavItems = getSecondaryNavItems(t);

	return (
		<>
			<div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
				<div className="flex items-center justify-between px-2">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								cn(
									'flex flex-col items-center gap-1 p-2 text-gray-400 transition-colors hover:text-gray-900',
									isActive && 'text-gray-900',
								)
							}
						>
							{({ isActive }) => (
								<>
									<div
										className={cn(
											'flex h-10 w-10 items-center justify-center rounded-full transition-all',
											isActive &&
												'bg-[#1c1c1e] text-white shadow-md',
										)}
									>
										<item.icon className="h-5 w-5" />
									</div>
									<span className="text-[10px] font-medium">
										{item.label}
									</span>
								</>
							)}
						</NavLink>
					))}

					<div className="relative -top-6">
						<Button
							size="icon"
							className="h-14 w-14 rounded-full bg-[#1c1c1e] text-white shadow-lg hover:bg-[#2c2c2e] focus:ring-4 focus:ring-slate-200"
							onClick={() => setIsTransactionFormOpen(true)}
						>
							<Plus className="h-6 w-6" />
						</Button>
					</div>

					{secondaryNavItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								cn(
									'flex flex-col items-center gap-1 p-2 text-gray-400 transition-colors hover:text-gray-900',
									isActive && 'text-gray-900',
								)
							}
						>
							{({ isActive }) => (
								<>
									<div
										className={cn(
											'flex h-10 w-10 items-center justify-center rounded-full transition-all',
											isActive &&
												'bg-[#1c1c1e] text-white shadow-md',
										)}
									>
										<item.icon className="h-5 w-5" />
									</div>
									<span className="text-[10px] font-medium">
										{item.label}
									</span>
								</>
							)}
						</NavLink>
					))}
				</div>
			</div>

			<TransactionForm
				open={isTransactionFormOpen}
				onOpenChange={setIsTransactionFormOpen}
			/>
		</>
	);
}
