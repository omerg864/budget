import { SupportedIcons } from '@shared/constants/ledger.constants';
import {
	Car,
	Clapperboard,
	GraduationCap,
	Heart,
	HelpCircle,
	Home,
	Plane,
	Shapes,
	ShoppingCart,
	Utensils,
} from 'lucide-react';
import type { ElementType } from 'react';

export function getIcon(icon: string | undefined): ElementType | undefined {
	if (!icon) {
		return undefined;
	}
	switch (icon) {
		case SupportedIcons.Home:
			return Home;
		case SupportedIcons.Car:
			return Car;
		case SupportedIcons.Food:
			return Utensils;
		case SupportedIcons.Shopping:
			return ShoppingCart;
		case SupportedIcons.Health:
			return Heart;
		case SupportedIcons.Education:
			return GraduationCap;
		case SupportedIcons.Entertainment:
			return Clapperboard;
		case SupportedIcons.Travel:
			return Plane;
		case SupportedIcons.Other:
			return Shapes;
		default:
			return HelpCircle;
	}
}
