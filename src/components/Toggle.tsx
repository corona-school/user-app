import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/Tailwind';

const toggleVariants = cva(
    'inline-flex items-center justify-center rounded-md text-form font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
    {
        variants: {
            variant: {
                default: 'hover:bg-accent hover:text-accent-foreground',
                outline: 'border border-input data-[state=on]:border-primary-light bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
                'outline-primary': 'border border-primary text-primary bg-transparent hover:bg-accent hover:text-accent-foreground',
                white: 'bg-white data-[state=on]:border-primary',
                'white-primary':
                    'text-primary bg-white border border-white hover:text-primary hover:bg-accent-dark hover:border-primary-lighter data-[state=on]:border-primary-light data-[state=on]:bg-accent-dark data-[state=on]:text-primary transition-colors duration-300',
            },
            size: {
                default: 'h-9 px-3',
                sm: 'h-8 px-2',
                lg: 'h-10 px-3',
                '2xl': 'w-[280px] h-[100px] text-medium gap-[10px]',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export type ToggleVariants = VariantProps<typeof toggleVariants>;

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & ToggleVariants>(
    ({ className, variant, size, ...props }, ref) => <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
);

export { Toggle, toggleVariants };
