import { useLedgerQuery } from '@/api/ledger.api.ts';
import { useUserQuery } from '@/api/user.api';
import PageDisplay from '@/components/layout/PageDisplay';
import PageTitle from '@/components/layout/PageTitle';
import SettingsItem from '@/components/settings/SettingsItem.tsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { authClient } from '@/lib/clients/auth.client';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePreferencesStore } from '@/stores/usePreferences.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import {
	CreditCard,
	LogOut,
	Nfc,
	NotebookPen,
	Pencil,
	Shapes,
	Share,
	User,
} from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const Settings: FC = () => {
	const { t } = useTranslation('settings');
	const { data: user, isLoading: isLoadingUser } = useUserQuery();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { removeAuthenticated } = useAuthStore();
	const { ledgerId } = usePreferencesStore();
	const { data: ledger, isLoading: isLoadingLedger } = useLedgerQuery(
		ledgerId ?? undefined,
	);

	const isLoading = isLoadingLedger || isLoadingUser;

	const handleLogout = useMemoizedFn(() => {
		try {
			authClient.signOut();
			removeAuthenticated();
			queryClient.clear();
			navigate('/');
		} catch (error) {
			console.error('Logout failed', error);
			toast.error('Failed to log out');
		}
	});

	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			<PageDisplay
				isLoading={isLoading}
				fixed={
					<PageTitle title={t('title')}>
						<Button variant="outline" onClick={handleLogout}>
							<LogOut className="ms-2 h-4 w-4" />
							{t('logOut')}
						</Button>
					</PageTitle>
				}
			>
				<div className="mt-6 space-y-6 flex flex-col flex-1 overflow-y-auto pb-4 px-1">
					{/* Profile Card */}
					<Card className="bg-blue-500 text-white p-6 rounded-3xl border-0 shadow-lg relative overflow-hidden shrink-0">
						<div className="relative z-10 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
									<User size={28} />
								</div>
								<div>
									<h2 className="text-xl font-bold">
										{user?.name || 'Alex Johnson'}
									</h2>
									<p className="text-blue-100 text-sm">
										{user?.email || 'alex.j@example.com'}
									</p>
								</div>
							</div>
							<Button
								size="icon"
								className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0 h-10 w-10 backdrop-blur-sm"
								onClick={() => navigate('/settings/profile')}
							>
								<Pencil size={18} />
							</Button>
						</div>
						{/* Decorative background circle */}
						<div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
					</Card>

					{/* Main Settings */}
					<div className="flex flex-col gap-4 justify-between flex-1">
						<div className="space-y-3">
							<h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
								{t('preferences', {
									ledgerName: ledger?.name || 'Ledger',
								})}
							</h3>
							<SettingsItem
								icon={CreditCard}
								title={t('bills')}
								subtitle={t('manageBills')}
								onClick={() => navigate('/settings/bills')}
							/>
							<SettingsItem
								icon={Shapes}
								title={t('categories')}
								subtitle={t('manageCategories')}
								onClick={() => navigate('/settings/categories')}
							/>
							<SettingsItem
								icon={Share}
								title={t('sharing')}
								subtitle={t('manageSharing')}
								onClick={() => navigate('/settings/sharing')}
							/>
						</div>

						{/* Preferences */}
						<div>
							<h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
								{t('manage')}
							</h3>
							<div className="space-y-3">
								<SettingsItem
									icon={NotebookPen}
									title={t('ledgers')}
									subtitle={t('manageLedgers')}
									onClick={() =>
										navigate('/settings/ledgers')
									}
								/>
								<SettingsItem
									icon={Nfc} // Using CreditCard as proxy for Apple Pay icon
									title={t('applePay')}
									subtitle={t('connectedAndReady')}
								/>
							</div>
						</div>

						<div className="mb-2 shrink-0 text-center text-gray-400 text-sm mt-4">
							{t('version', { version: '3.1.2 (2024)' })}
						</div>
					</div>
				</div>
			</PageDisplay>
		</div>
	);
};

export default Settings;
