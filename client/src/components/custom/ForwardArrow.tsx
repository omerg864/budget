import { ChevronLeft, ChevronRight, type LucideProps } from 'lucide-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const ForwardArrow: FC<LucideProps> = (props) => {
	const { i18n } = useTranslation();
	const dir = i18n.dir();

	if (dir === 'rtl') {
		return <ChevronLeft {...props} />;
	}

	return <ChevronRight {...props} />;
};

export default ForwardArrow;
