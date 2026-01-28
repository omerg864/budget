import 'i18next';
import en from './locale/locales/en';

declare module 'i18next' {
	interface CustomTypeOptions {
		// Infers keys from your default language file (en)
		resources: typeof en;
	}
}
