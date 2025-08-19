import { Button } from '@/components/Button';
import { Typography, TypographyProps } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import React from 'react';

interface _RegistrationStepProps {
    children: React.ReactNode;
    onBack?: () => void;
    onNext?: () => void;
    isNextDisabled?: boolean;
    isBackDisabled?: boolean;
    className?: string;
}

export type RegistrationStepProps = Omit<_RegistrationStepProps, 'children'>;

export const RegistrationStepTitle = ({ className, variant = 'h2', children, ...rest }: TypographyProps) => {
    return (
        <Typography className={cn('text-center text-balance mb-4', className)} variant={variant} {...rest}>
            {children}
        </Typography>
    );
};

export const RegistrationStep = ({ onBack, onNext, isBackDisabled, isNextDisabled, className, children }: _RegistrationStepProps) => {
    return (
        <div className={cn('animate-in fade-in-5 duration-300 relative flex flex-col flex-1 max-w-full md:max-w-[800px] w-full mx-auto md:pb-24', className)}>
            <div className="z-10 flex flex-1 flex-col items-center justify-center max-w-full md:max-w-[536px] mx-auto px-[23px] md:px-0">{children}</div>
            <div className="md:absolute bottom-0 px-10 flex justify-between w-full pb-8 md:bottom-1/2 md:px-0">
                <Button
                    disabled={isBackDisabled}
                    onClick={onBack}
                    variant="ghost"
                    className={cn('size-[70px] rounded-full border border-transparent hover:border-primary transition-colors duration-300 ease-in-out px-0', {
                        invisible: !onBack,
                    })}
                >
                    <IconArrowLeft size={48} className="!stroke-[2px]" />
                </Button>
                <Button
                    disabled={isNextDisabled}
                    onClick={onNext}
                    variant="ghost"
                    className={cn('size-[70px] rounded-full border border-transparent hover:border-primary transition-colors duration-300 ease-in-out px-0', {
                        invisible: !onNext,
                    })}
                >
                    <IconArrowRight size={48} className="!stroke-[2px]" />
                </Button>
            </div>
        </div>
    );
};
