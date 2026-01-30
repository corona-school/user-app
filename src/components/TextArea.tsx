import * as React from 'react';
import { cn } from '@/lib/Tailwind';
import { cva, VariantProps } from 'class-variance-authority';
import { Typography } from './Typography';

const textAreaVariants = cva(
    'flex min-h-[60px] rounded-md px-3 py-3 text-form leading-3 font-normal text-primary placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary-light',
    {
        variants: {
            variant: {
                default: 'border border-input bg-transparent focus:border-primary-light',
                white: 'bg-white focus:border-primary-light',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textAreaVariants> {
    onChangeText?: (text: string) => void;
    errorMessage?: string;
    errorMessageClassName?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, onChange, onChangeText, variant = 'default', errorMessage, errorMessageClassName, ...props }, ref) => {
        const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (onChange) {
                onChange(event);
            }
            if (onChangeText) {
                onChangeText(event.target.value);
            }
        };
        return (
            <>
                <textarea
                    className={cn(textAreaVariants({ variant, className }), { 'border border-destructive': !!errorMessage })}
                    ref={ref}
                    onChange={handleOnChange}
                    {...props}
                />
                <Typography
                    variant="sm"
                    className={cn(
                        'text-destructive text-[12px] px-1 min-h-5 leading-1',
                        {
                            invisible: !errorMessage,
                        },
                        errorMessageClassName
                    )}
                >
                    {errorMessage}
                </Typography>
            </>
        );
    }
);

export { TextArea };
