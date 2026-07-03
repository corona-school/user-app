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
    nextButtonIcon?: React.ReactNode;
}

export type MatchRequestStepProps = Omit<_MatchRequestStepProps, 'children'>;

export const MatchRequestStepTitle = ({ className, variant = 'h4', children, ...rest }: TypographyProps) => {
    return (
        <Typography className={cn('text-balance mb-2 mt-[30px]', className)} variant={variant} {...rest}>
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
    nextButtonIcon,
}: _MatchRequestStepProps) => {
    const { t } = useTranslation();
    const handleOnSubmit = () => {
        if (!isNextDisabled && onNext) {
            onNext();
        }
    };

    return (
        <div className={cn('animate-in fade-in-5 duration-300 relative flex flex-col flex-1 max-w-[1140px] w-full gap-y-4 md:gap-y-10', className)}>
            <div className="flex flex-1 flex-col max-w-full">{children}</div>
            {onBack || onNext ? (
                <div className="flex flex-col md:flex-row gap-y-4 gap-x-4">
                    <Button
                        disabled={isBackDisabled}
                        className={cn('md:w-[224px] w-full', {
                            hidden: !onBack,
                        })}
                        variant="outline"
                        onClick={onBack}
                        size="lg"
                    >
                        <IconArrowLeft size={20} />
                        {backButtonText || t('back')}
                    </Button>
                    <Button
                        disabled={isNextDisabled}
                        reasonDisabled={reasonNextDisabled}
                        className={cn('md:w-[224px] w-full', {
                            hidden: !onNext,
                        })}
                        onClick={handleOnSubmit}
                        size="lg"
                    >
                        {nextButtonIcon ? nextButtonIcon : <IconCheck size={20} />}
                        {nextButtonText || t('nextWithSelection')}
                    </Button>
                </div>
            ) : (
                <div className="h-3"></div>
            )}
        </div>
    );
};
