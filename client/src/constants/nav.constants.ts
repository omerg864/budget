import type { TFunction } from 'i18next';
import { FileText, Home, Landmark, Settings } from 'lucide-react';

export const getNavItems = (t: TFunction<'nav'>) => [
	{
		to: '/',
		icon: Home,
		label: t('summary'),
	},
	{
		to: '/transactions',
		icon: FileText,
		label: t('transactions'),
	},
];

export const getSecondaryNavItems = (t: TFunction<'nav'>) => [
	{
		to: '/accounts',
		icon: Landmark,
		label: t('accounts'),
	},
	{
		to: '/settings',
		icon: Settings,
		label: t('settings'),
	},
];
