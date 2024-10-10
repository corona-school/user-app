import { useTranslation } from 'react-i18next';
import { Course_Coursestate_Enum } from '../gql/graphql';
import { useMemo } from 'react';
import { Button, ButtonProps } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { TooltipButton } from '@/components/Tooltip';
import { IconInfoCircleFilled } from '@tabler/icons-react';

type CourseBannerProps = {
    courseState: Course_Coursestate_Enum;
    isCourseCancelled: boolean;
    isPublished: boolean;
    handleButtonClick: () => void;
};

interface State {
    text?: string;
    tooltipText?: string;
    buttonText?: string;
    buttonVariant?: ButtonProps['variant'];
    textColor?: string;
}

const CourseBanner: React.FC<CourseBannerProps> = ({ courseState, isCourseCancelled, isPublished, handleButtonClick }) => {
    const { t } = useTranslation();

    const state = useMemo<State>(() => {
        if (courseState === Course_Coursestate_Enum.Created)
            return {
                text: t('single.banner.created.draft'),
                tooltipText: t('single.banner.created.info'),
                buttonText: t('single.banner.created.button'),
                buttonVariant: 'default',
                textColor: 'text-primary',
            };
        if (courseState === Course_Coursestate_Enum.Submitted)
            return {
                text: t('single.banner.submitted.isChecked'),
                tooltipText: t('single.banner.submitted.info'),
                textColor: 'text-primary',
            };
        if (courseState === Course_Coursestate_Enum.Allowed && !isPublished)
            return {
                text: t('single.banner.allowedNotPublished.checked'),
                tooltipText: t('single.banner.allowedNotPublished.info'),
                buttonText: t('single.banner.allowedNotPublished.button'),
                buttonVariant: 'ghost',
                textColor: 'text-green-700',
            };
        if (courseState === Course_Coursestate_Enum.Allowed && isPublished)
            return {
                text: t('single.banner.allowedAndPublished.published'),
                tooltipText: t('single.banner.allowedAndPublished.info'),
                buttonText: t('single.banner.allowedAndPublished.button'),
                buttonVariant: 'ghost',
                textColor: 'text-green-700',
            };
        if (courseState === Course_Coursestate_Enum.Denied)
            return {
                text: t('single.banner.rejected.state'),
                tooltipText: t('single.banner.rejected.info'),
                buttonText: t('single.banner.rejected.button'),
                buttonVariant: 'outline',
                textColor: 'text-destructive',
            };
        return {};
    }, [courseState, isPublished]);

    if (isCourseCancelled) return null;

    return (
        <div className="flex flex-col items-center bg-white border border-gray-300 justify-between w-full max-w-[460px] p-4 rounded-lg md:flex-row">
            <div className="flex mb-3 md:mb-0">
                <Typography className="font-bold">{t('single.banner.state')}</Typography>
                <Typography className={`ml-1 mr-2 ${state.textColor}`}>{state.text}</Typography>

                <TooltipButton className="w-80" tooltipContent={!isPublished ? state.tooltipText : t('single.banner.allowedAndPublished.info')}>
                    <IconInfoCircleFilled />
                </TooltipButton>
            </div>

            {courseState !== Course_Coursestate_Enum.Submitted && (
                <Button className="w-full md:w-fit" variant={state.buttonVariant} onClick={handleButtonClick}>
                    {state.buttonText}
                </Button>
            )}
        </div>
    );
};

export default CourseBanner;
