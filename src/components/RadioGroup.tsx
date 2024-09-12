import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/Tailwind';

const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>(
    ({ className, ...props }, ref) => {
        return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
    }
);

const RadioGroupItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>>(
    ({ className, ...props }, ref) => {
        return (
            <RadioGroupPrimitive.Item
                ref={ref}
                className={cn(
                    'aspect-square size-6 rounded-full border-[0.5px] border-primary data-[state=checked]:bg-primary text-primary-foreground shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <IconCheck className="size-3" />
                </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
        );
    }
);

export { RadioGroup, RadioGroupItem };
