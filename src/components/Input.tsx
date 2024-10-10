import * as React from 'react';
import { cn } from '@/lib/Tailwind';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-10 rounded-md border border-input bg-transparent px-3 py-1 text-form font-normal text-primary transition-colors file:border-0 file:bg-transparent file:text-form file:py-2 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

export { Input };
