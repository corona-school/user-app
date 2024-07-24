import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@lib/Tailwind';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-primary-light text-primary bg-background hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-6 py-6 text-base',
                sm: 'h-9 rounded-md px-3 text-sm',
                lg: 'h-11 rounded-md px-8 text-base',
                icon: 'h-10 w-10',
            },
            colorSchema: {
                primary: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    reasonDisabled?: string;
    disabledContent?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, reasonDisabled, disabledContent, ...props }, ref) => {
        const SlotContent = asChild ? Slot : 'button';
        const Component = <SlotContent className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{props.disabled ? <span>{Component}</span> : Component}</TooltipTrigger>
                    {props.disabled && reasonDisabled && <TooltipContent>{reasonDisabled}</TooltipContent>}
                </Tooltip>
            </TooltipProvider>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
