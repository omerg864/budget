import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import BaseSelector, { type BaseSelectorProps } from './BaseSelector';

export type LanguageSelectorProps = Omit<
	BaseSelectorProps,
	'options' | 'value' | 'onValueChange'
>;

const options = [
	{ value: 'en', label: '🇺🇸' },
	{ value: 'he', label: '🇮🇱' },
];

const LanguageSelector: FC<LanguageSelectorProps> = (props) => {
	const { i18n } = useTranslation();

	const handleLanguageChange = (value: string) => {
		i18n.changeLanguage(value);
	};

	return (
		<BaseSelector
			{...props}
			value={i18n.language}
			onValueChange={handleLanguageChange}
			options={options}
		/>
	);
};

export default LanguageSelector;
