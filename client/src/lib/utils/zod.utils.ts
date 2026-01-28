import { z } from 'zod';
import * as locales from 'zod/locales'; // Import all locales (or cherry-pick them)

export const setZodLocale = (lang: string) => {
	// Map your app's language code to Zod's locale export
	const localeMap: Record<string, typeof locales.en> = {
		en: locales.en,
		es: locales.es,
		fr: locales.fr,
		de: locales.de,
		he: locales.he,
		it: locales.it,
		ja: locales.ja,
		ko: locales.ko,
		pl: locales.pl,
		pt: locales.pt,
		ru: locales.ru,
		ar: locales.ar,
		az: locales.az,
		be: locales.be,
		bg: locales.bg,
		ca: locales.ca,
		cs: locales.cs,
		da: locales.da,
		fa: locales.fa,
		fi: locales.fi,
		frCA: locales.frCA,
		hu: locales.hu,
	};

	const selectedLocale = localeMap[lang] || locales.en;

	// Apply the configuration
	z.config(selectedLocale());
};
