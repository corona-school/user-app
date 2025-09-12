import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/Tailwind';

export const ProgressBar = ({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) => {
    return (
        <ProgressPrimitive.Root data-slot="progress" className={cn('bg-white relative h-2 w-full overflow-hidden rounded-full', className)} {...props}>
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="bg-primary h-full w-full flex-1 transition-all rounded-3xl"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
};
