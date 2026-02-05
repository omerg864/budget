import { ChevronLeft, ChevronRight, type LucideProps } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const BackArrow: FC<LucideProps> = (props) => {
	const { i18n } = useTranslation();
	const dir = i18n.dir();

	if (dir === 'rtl') {
		return <ChevronRight {...props} />;
	}

	return <ChevronLeft {...props} />;
};

export default BackArrow;
