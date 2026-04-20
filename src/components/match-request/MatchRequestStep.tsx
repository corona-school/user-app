import { cn } from '@/lib/Tailwind';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { Typography, TypographyProps } from '../Typography';

interface _MatchRequestStepProps {
    children: React.ReactNode;
    onBack?: () => void;
    onNext?: () => void;
    onCancel?: () => void;
    isNextDisabled?: boolean;
    isBackDisabled?: boolean;
    nextButtonText?: string;
    backButtonText?: string;
    className?: string;
    reasonNextDisabled?: string;
}

export type MatchRequestStepProps = Omit<_MatchRequestStepProps, 'children'>;

export const MatchRequestStepTitle = ({ className, variant = 'h4', children, ...rest }: TypographyProps) => {
    return (
        <Typography className={cn('text-balance mb-2', className)} variant={variant} {...rest}>
            {children}
        </Typography>
    );
};

export const MatchRequestStepDescription = ({ className, variant = 'body', children, ...rest }: TypographyProps) => {
    return (
        <Typography className={cn('text-base whitespace-pre-line text-balance', className)} {...rest}>
            {children}
        </Typography>
    );
};

export const MatchRequestStep = ({
    children,
    onBack,
    onNext,
    onCancel,
    isNextDisabled,
    isBackDisabled,
    className,
    reasonNextDisabled,
    nextButtonText,
    backButtonText,
}: _MatchRequestStepProps) => {
    const { t } = useTranslation();
    const handleOnSubmit = () => {
        if (!isNextDisabled && onNext) {
            onNext();
        }
    };

    return (
        <div className={cn('animate-in fade-in-5 duration-300 relative flex flex-col flex-1 max-w-full w-full', className)}>
            <div className="z-10 flex flex-1 flex-col max-w-full py-10">{children}</div>
            {onBack || onNext ? (
                <div className="flex gap-x-4">
                    <Button
                        disabled={isBackDisabled}
                        className={cn('', {
                            hidden: !onBack,
                        })}
                        variant="outline"
                        onClick={onBack}
                    >
                        <IconArrowLeft size={14} className="!stroke-[2px]" />
                        {backButtonText || t('back')}
                    </Button>
                    <Button
                        disabled={isNextDisabled}
                        reasonDisabled={reasonNextDisabled}
                        className={cn('', {
                            hidden: !onNext,
                        })}
                        onClick={handleOnSubmit}
                    >
                        <IconCheck size={14} className="!stroke-[2px]" />
                        {nextButtonText || t('next')}
                    </Button>
                </div>
            ) : (
                <div className="h-3"></div>
            )}
        </div>
    );
};
