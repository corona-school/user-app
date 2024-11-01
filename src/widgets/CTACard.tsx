import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';

interface CTACardProps {
    className?: string;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    button?: React.ReactNode;
}

const CTACard = ({ className, icon, title, children, button }: CTACardProps) => {
    return (
        <div className={cn('flex flex-col bg-primary-lighter/80 gap-y-4 rounded-md p-6 lg:py-6 lg:px-10', className)}>
            <div className="flex gap-x-4 items-center justify-center lg:justify-start">
                <div>{icon}</div>
                <Typography variant="h5">{title}</Typography>
            </div>
            <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-8">
                <div>{children}</div>
                {button}
            </div>
        </div>
    );
};
export default CTACard;
