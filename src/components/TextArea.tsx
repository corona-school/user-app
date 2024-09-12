import * as React from 'react';
import { cn } from '@/lib/Tailwind';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                'flex min-h-[60px] rounded-md border border-input bg-transparent px-3 py-2 text-base text-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

export { TextArea };
