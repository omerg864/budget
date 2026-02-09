import { authClient } from '@/lib/clients/auth.client';
import type { Passkey } from '@better-auth/passkey/client';
import { Fingerprint, Plus } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const PasskeySettings: FC = () => {
	const { t } = useTranslation('profile');
	const [passKeys, setPassKeys] = useState<Passkey[]>([]);

	const handleAddPasskey = async () => {
		try {
			await authClient.passkey.addPasskey();
			toast.success(t('passkeys.successMessages.add'));
		} catch (error: any) {
			console.error('Failed to add passkey', error);
			toast.error(error?.message || t('passkeys.errorMessages.add'));
		}
	};

	useEffect(() => {
		const fetchPasskeys = async () => {
			const passkeys = await authClient.passkey.listUserPasskeys();
			setPassKeys(passkeys.data || []);
		};
		fetchPasskeys();
	}, []);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xl font-bold">
					<div className="flex items-center gap-2">
						<Fingerprint className="h-5 w-5" />
						{t('passkeys.title')}
					</div>
				</CardTitle>
				<Button size="sm" onClick={handleAddPasskey}>
					<Plus className="mr-2 h-4 w-4" />
					{t('passkeys.add')}
				</Button>
			</CardHeader>
			<CardContent>
				{passKeys.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						{t('passkeys.noPasskeys')}
					</p>
				) : (
					<div className="space-y-2">
						{passKeys.map((passkey) => (
							<div
								key={passkey.id}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-2">
									<Fingerprint className="h-4 w-4" />
									<span className="text-sm">
										{t('passkeys.passkey')}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default PasskeySettings;
