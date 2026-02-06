import { useRemoveUserMutation } from '@/api/ledger.api';
import { useUsersByLedgerQuery } from '@/api/user.api';
import { Loader } from '@/components/custom/Loader';
import LedgerAccessRoleFormatter from '@/components/formatters/LedgerAccessRoleFormatter';
import { usePreferencesStore } from '@/stores/usePreferences';
import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import BackButton from '../components/custom/BackButton';
import PageTitle from '../components/layout/PageTitle';
import { SharingForm } from '../components/sharing/SharingForm';
import { Button } from '../components/ui/button';

const Sharing: FC = () => {
	const { t } = useTranslation('sharing');
	const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
	const { ledgerId } = usePreferencesStore();
	const { data: users = [], isLoading } = useUsersByLedgerQuery(
		ledgerId ?? undefined,
	);
	const { mutateAsync: removeUser, isPending } = useRemoveUserMutation();

	const handleRemoveUser = async (userId: string) => {
		try {
			if (confirm(t('confirmDelete'))) {
				await removeUser(userId);
				toast.success(t('userRemoved'));
			}
		} catch (error: any) {
			toast.error(error?.response?.data?.message || error.message);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-2">
					<BackButton />
					<PageTitle title={t('title')} />
				</div>
				<Button onClick={() => setIsAddUserModalOpen(true)}>
					{t('addUser')}
				</Button>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{isLoading ? (
					<Loader />
				) : (
					users.map((user) => (
						<div
							key={user.id}
							className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-lg shadow"
						>
							<div>
								<p className="font-medium">{user.name}</p>
								<p className="text-sm text-gray-500">
									{user.email}
								</p>
								<LedgerAccessRoleFormatter value={user.role} />
							</div>
							{user.role !== 'owner' && (
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleRemoveUser(user.id)}
									disabled={isPending}
								>
									{t('remove')}
								</Button>
							)}
						</div>
					))
				)}
			</div>

			<SharingForm
				open={isAddUserModalOpen}
				onOpenChange={setIsAddUserModalOpen}
			/>
		</div>
	);
};

export default Sharing;
