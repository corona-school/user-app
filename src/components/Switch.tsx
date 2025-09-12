import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/Tailwind';

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(
    ({ className, ...props }) => (
        <SwitchPrimitive.Root
            className={cn('relative h-[25px] w-[42px] cursor-default rounded-full bg-blackA6 bg-primary-light data-[state=checked]:bg-primary', className)}
            {...props}
        >
            <SwitchPrimitive.Thumb
                className={cn(
                    'block size-[21px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]'
                )}
            />
        </SwitchPrimitive.Root>
    )
);

export { Switch };
