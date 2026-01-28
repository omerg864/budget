import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetwork } from 'ahooks';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NetworkBanner = () => {
	const { downlink, online } = useNetwork();

	const { t } = useTranslation('generic');

	// Don't show banner if online and good connection
	if (online && (!downlink || downlink > 0.5)) {
		return null;
	}

	// Offline state
	if (!online) {
		return (
			<div className="fixed bottom-0 left-0 right-0 z-50 p-4">
				<Alert className="border-danger-border bg-danger-background text-danger-hover shadow-lg">
					<WifiOff className="h-4 w-4" />
					<AlertDescription className="flex items-center gap-2">
						<span className="font-medium">
							{t('noInternetConnection')}
						</span>
						<span>•</span>
						<span>{t('pleaseCheckYouNetworkSettings')}</span>
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	// Slow connection state
	if (downlink && downlink <= 0.5) {
		return (
			<div className="fixed bottom-0 left-0 right-0 z-50 p-4">
				<Alert className="border-orange-200 bg-orange-50 text-orange-800 shadow-lg">
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription className="flex items-center gap-2">
						<span className="font-medium">
							{t('slowConnectionDetected')}
						</span>
						<span>•</span>
						<span>{t('thisPageMayTakeLongerToLoad')}</span>
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return null;
};

export default NetworkBanner;
