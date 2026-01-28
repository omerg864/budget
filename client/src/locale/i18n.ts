import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import your local translation files
import en from './locales/en';
import he from './locales/he';

// Define the resources object
const resources = {
	en: en,
	he: he,
};

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources, // Pass the imported resources here
		fallbackLng: 'en',
		debug: true,

		interpolation: {
			escapeValue: false, // React handles escaping
		},

		// crucial for local files: ensures we don't look for a backend
		react: {
			useSuspense: false, // Set to false because local files load instantly
		},
	});

export default i18n;
