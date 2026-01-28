import BottomNav from '@/components/layout/BottomNav';
import SideNav from '@/components/layout/SideNav';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/useAuthStore';

const AuthenticatedRoute: FC = () => {
	const { t } = useTranslation('generic');

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	useEffect(() => {
		if (!isAuthenticated) {
			toast.error(t('sessionExpiredPleaseLogIn'));
		}
	}, [isAuthenticated, t]);

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="pb-28 md:ps-28 md:pb-0 py-6 px-6 flex-1">
			<Outlet />
			<div className="md:hidden">
				<BottomNav />
			</div>
			<div className="hidden md:block">
				<SideNav />
			</div>
		</div>
	);
};

export default AuthenticatedRoute;
