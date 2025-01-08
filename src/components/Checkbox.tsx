import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/Tailwind';
import { CheckedState } from '@radix-ui/react-checkbox';

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
    ({ className, ...props }, ref) => (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                'peer size-6 shrink-0 rounded-sm border-[0.5px] border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
                <IconCheck className="size-4" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
);

export { Checkbox };
export type { CheckedState };
