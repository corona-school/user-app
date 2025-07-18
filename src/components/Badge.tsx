import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/Tailwind';

const badgeVariants = cva(
    'inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground shadow',
                secondary: 'border-transparent bg-secondary text-secondary-foreground',
                destructive: 'border-transparent bg-destructive text-destructive-foreground shadow',
                success: 'border-transparent bg-success text-success-foreground shadow',
                caution: 'border-transparent bg-caution text-caution-foreground shadow',
                unclear: 'border-transparent bg-unclear text-unclear-foreground shadow',
                purple: 'border-transparent bg-purple text-purple-foreground shadow',
                teal: 'border-transparent bg-teal text-teal-foreground shadow',
                outline: 'text-foreground',
            },
            shape: {
                default: 'rounded-md w-fit',
                rounded: 'rounded-full size-5 p-0 justify-center',
            },
        },
        defaultVariants: {
            variant: 'default',
            shape: 'default',
        },
    }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, shape, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant, shape }), className)} {...props} />;
}

export { Badge, badgeVariants };
