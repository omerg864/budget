import { useUserQuery } from '@/api/user.api';
import BackButton from '@/components/custom/BackButton.tsx';
import PageDisplay from '@/components/layout/PageDisplay';
import PageTitle from '@/components/layout/PageTitle.tsx';
import PasskeySettings from '@/components/profile/PasskeySettings';
import UserSettings from '@/components/profile/UserSettings';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const Profile: FC = () => {
	const { t } = useTranslation('profile');
	const { isLoading: isLoadingUser } = useUserQuery();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			<PageDisplay
				isLoading={isLoadingUser}
				fixed={
					<PageTitle
						className="mb-2"
						title={
							<div className="flex items-center gap-2">
								<BackButton onClick={() => navigate(-1)} />
								<h1 className="text-2xl font-bold">
									{t('title')}
								</h1>
							</div>
						}
					/>
				}
			>
				<div className="flex flex-col flex-1 overflow-y-auto px-4 pb-4 gap-4">
					<UserSettings />

					<PasskeySettings />
				</div>
			</PageDisplay>
		</div>
	);
};

export default Profile;
