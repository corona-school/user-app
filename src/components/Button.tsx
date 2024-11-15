import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/Tailwind';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';
import { IconLoader2 } from '@tabler/icons-react';

const buttonVariants = cva(
    'w-fit inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-primary text-primary bg-transparent hover:bg-accent hover:text-accent-foreground',
                'outline-light': 'border border-primary-light text-primary-light bg-transparent hover:bg-primary-lighter hover:text-primary',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                none: 'text-primary',
                input: 'border border-input justify-between bg-transparent text-form font-normal ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:w-full [&>span]:justify-between',
            },
            size: {
                default: 'h-10 px-4 text-form',
                sm: 'h-9 rounded-md px-3 text-sm',
                lg: 'h-11 rounded-md px-8 text-base',
                input: 'h-10 px-3 py-1',
                icon: 'h-10 w-10',
                auto: 'h-auto w-auto',
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
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant, size, asChild = false, reasonDisabled, disabledContent, disabled, isLoading, children, leftIcon, rightIcon, onClick, ...props },
        ref
    ) => {
        const SlotContent = asChild ? Slot : 'button';
        const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);

        const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (disabled && !reasonDisabled) {
                e.stopPropagation();
                return;
            }

            if (disabled && reasonDisabled) {
                setIsTooltipOpen(true);
                e.stopPropagation();
                return;
            }

            if (onClick) {
                e.stopPropagation();
                onClick(e);
            }
        };

        const Component = (
            <SlotContent
                onClick={handleOnClick}
                className={cn(
                    buttonVariants({ variant, size, className }),
                    disabled ? 'opacity-50 cursor-auto' : '',
                    disabled && variant === 'input' ? 'cursor-auto pointer-events-none' : ''
                )}
                ref={ref}
                aria-disabled={disabled || isLoading}
                disabled={(disabled && !reasonDisabled) || isLoading}
                {...props}
            >
                <span className={`inline-flex gap-x-2 items-center justify-center ${isLoading ? 'invisible' : ''}`}>
                    {leftIcon && leftIcon}
                    {disabled && disabledContent ? disabledContent : children}
                    {rightIcon && rightIcon}
                </span>
                {isLoading && <IconLoader2 className="absolute h-4 w-4 animate-spin" />}
            </SlotContent>
        );

        if (disabled && reasonDisabled) {
            return (
                <TooltipProvider>
                    <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                        <TooltipTrigger asChild>{Component}</TooltipTrigger>
                        <TooltipContent>{reasonDisabled}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        return <>{Component}</>;
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
