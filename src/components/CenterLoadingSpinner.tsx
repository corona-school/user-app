import { cn } from '@/lib/Tailwind';
import { IconLoader2 } from '@tabler/icons-react';

type Props = {
    className?: string;
};

const CenterLoadingSpinner: React.FC<Props> = ({ className }) => {
    return (
        <div className="flex flex-1 justify-center items-center">
            <IconLoader2 className={cn('size-6 text-primary animate-spin', className)} />
        </div>
    );
};
export default CenterLoadingSpinner;
