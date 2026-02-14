import { useDir } from '@/hooks/useDir';
import { ChevronLeft, ChevronRight, type LucideProps } from 'lucide-react';
import type { FC } from 'react';

const ForwardArrow: FC<LucideProps> = (props) => {
	const dir = useDir();

	if (dir === 'rtl') {
		return <ChevronLeft {...props} />;
	}

	return <ChevronRight {...props} />;
};

export default ForwardArrow;
