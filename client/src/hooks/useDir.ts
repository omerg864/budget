import { useTranslation } from 'react-i18next';

export function useDir() {
	const { i18n } = useTranslation();
	return i18n.dir(i18n.language);
}
