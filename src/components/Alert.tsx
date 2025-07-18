import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/Tailwind';

const alertVariants = cva('flex items-center w-fit rounded-lg px-4 py-3 text-base', {
    variants: {
        variant: {
            default: 'border-primary bg-primary-lighter text-foreground',
            destructive: 'bg-destructive-lighter text-destructive',
            success: 'bg-green-50 text-green-600',
        },
        direction: {
            row: 'flex-row gap-x-4',
            col: 'flex-col',
        },
    },
    defaultVariants: {
        variant: 'default',
        direction: 'row',
    },
});

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, Omit<VariantProps<typeof alertVariants>, 'direction'> {
    icon?: React.ReactNode;
    title?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, children, title, icon, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant, direction: icon ? 'row' : 'col' }), className)} {...props}>
        {icon && <div className={cn('pt-1', title ? 'self-start' : 'pt-0')}>{icon}</div>}
        <div className="flex flex-col items-start ">
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{children}</AlertDescription>
        </div>
    </div>
));

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <p ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
));

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-form font-normal [&_p]:leading-relaxed', className)} {...props} />
));

export { Alert };
