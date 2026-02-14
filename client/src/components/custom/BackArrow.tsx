import { useDir } from '@/hooks/useDir';
import { ChevronLeft, ChevronRight, type LucideProps } from 'lucide-react';
import type { FC } from 'react';

const BackArrow: FC<LucideProps> = (props) => {
	const dir = useDir();

	if (dir === 'rtl') {
		return <ChevronRight {...props} />;
	}

	return <ChevronLeft {...props} />;
};

export default BackArrow;
