import * as React from 'react';
import { cn } from '@/lib/Tailwind';
import { cva, VariantProps } from 'class-variance-authority';

const textAreaVariants = cva(
    'flex min-h-[60px] rounded-md px-3 py-3 text-form leading-3 font-normal text-primary placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'border border-input bg-transparent',
                white: 'bg-white',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textAreaVariants> {
    onChangeText?: (text: string) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, onChange, onChangeText, variant = 'default', ...props }, ref) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(event);
        }
        if (onChangeText) {
            onChangeText(event.target.value);
        }
    };
    return <textarea className={cn(textAreaVariants({ variant, className }))} ref={ref} onChange={handleOnChange} {...props} />;
});

export { TextArea };
