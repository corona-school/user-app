import { Button } from '@/components/Button';
import { useTranslation } from 'react-i18next';

export const NextPrevButtons = ({
    disablingPrev,
    disablingNext,
    onPressPrev,
    onPressNext,
    onlyNext,
    altNextText,
    altPrevText,
    isLoading,
}: {
    disablingNext?: { is: boolean; reason: string };
    disablingPrev?: { is: boolean; reason: string };
    onPressPrev?: () => void;
    onPressNext?: () => void;
    onlyNext?: boolean;
    altNextText?: string;
    altPrevText?: string;
    isLoading?: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center mt-2">
            <div className="flex w-full gap-2 justify-center items-stretch">
                {!onlyNext && (
                    <Button
                        disabled={disablingPrev?.is ?? false}
                        reasonDisabled={disablingPrev?.reason ?? ''}
                        className="w-full max-w-[220px]"
                        variant="outline"
                        onClick={onPressPrev}
                        isLoading={isLoading}
                    >
                        {altPrevText ?? t('back')}
                    </Button>
                )}
                <Button
                    disabled={disablingNext?.is ?? false}
                    reasonDisabled={disablingNext?.reason ?? ''}
                    className="w-full max-w-[220px]"
                    onClick={onPressNext}
                    isLoading={isLoading}
                >
                    {altNextText ?? t('next')}
                </Button>
            </div>
        </div>
    );
};
