import * as React from 'react';
import { cn } from '@/lib/Tailwind';
import { cva, VariantProps } from 'class-variance-authority';
import { Button } from './Button';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

const inputVariants = cva(
    'flex h-10 rounded-md px-3 py-1 text-form font-normal text-primary transition-colors file:border-0 file:bg-transparent file:text-form file:py-2 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 relative',
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

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    onChangeText?: (text: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, onChange, onChangeText, variant = 'default', ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(event);
        }
        if (onChangeText) {
            onChangeText(event.target.value);
        }
    };

    if (type === 'password') {
        return (
            <div className="relative w-auto">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={cn('w-full hide-password-toggle', inputVariants({ variant, className }))}
                    ref={ref}
                    onChange={handleOnChange}
                    {...props}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={props.disabled}
                >
                    {showPassword && !props.disabled ? (
                        <IconEye className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <IconEyeOff className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </Button>
            </div>
        );
    }

    return <input type={type} className={cn(inputVariants({ variant, className }))} ref={ref} onChange={handleOnChange} {...props} />;
});

export { Input };
