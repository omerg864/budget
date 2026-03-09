import { SupportedIcons } from '@shared/constants/ledger.constants';
import {
	CalendarCheck,
	Car,
	ChartCandlestick,
	Clapperboard,
	Code,
	Gift,
	GraduationCap,
	Heart,
	HelpCircle,
	Home,
	Plane,
	Plug,
	Shapes,
	Shirt,
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
		case SupportedIcons.Plug:
			return Plug;
		case SupportedIcons.Calendar:
			return CalendarCheck;
		case SupportedIcons.CandleStick:
			return ChartCandlestick;
		case SupportedIcons.Gift:
			return Gift;
		case SupportedIcons.Shirt:
			return Shirt;
		case SupportedIcons.Code:
			return Code;
		default:
			return HelpCircle;
	}
}
