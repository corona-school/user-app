import { useTranslation } from 'react-i18next';
import { Course_Coursestate_Enum } from '../gql/graphql';
import { useMemo } from 'react';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms/Tooltip';
import { IconInfoCircleFilled } from '@tabler/icons-react';

type CourseBannerProps = {
    courseState: Course_Coursestate_Enum;
    isCourseCancelled: boolean;
    isPublished: boolean;
    handleButtonClick: () => void;
};

const CourseBanner: React.FC<CourseBannerProps> = ({ courseState, isCourseCancelled, isPublished, handleButtonClick }) => {
    const { t } = useTranslation();

    const stateText = useMemo(() => {
        if (courseState === Course_Coursestate_Enum.Created) return t('single.banner.created.draft');
        if (courseState === Course_Coursestate_Enum.Submitted) return t('single.banner.submitted.isChecked');
        if (courseState === Course_Coursestate_Enum.Allowed && !isPublished) return t('single.banner.allowedNotPublished.checked');
        if (courseState === Course_Coursestate_Enum.Allowed && isPublished) return t('single.banner.allowedAndPublished.published');
        if (courseState === Course_Coursestate_Enum.Denied) return t('single.banner.rejected.state');
        return 'default';
    }, [courseState, isPublished]);

    const stateButtonText = useMemo(() => {
        if (courseState === Course_Coursestate_Enum.Created) return t('single.banner.created.button');
        if (courseState === Course_Coursestate_Enum.Allowed && isPublished) return t('single.banner.allowedAndPublished.button');
        if (courseState === Course_Coursestate_Enum.Allowed && !isPublished) return t('single.banner.allowedNotPublished.button');
        if (courseState === Course_Coursestate_Enum.Denied) return t('single.banner.rejected.button');
        return 'default';
    }, [courseState, isPublished]);

    const stateTooltipText = useMemo(() => {
        switch (courseState) {
            case Course_Coursestate_Enum.Created:
                return t('single.banner.created.info');
            case Course_Coursestate_Enum.Submitted:
                return t('single.banner.submitted.info');
            case Course_Coursestate_Enum.Allowed:
                return t('single.banner.allowedNotPublished.info');
            case Course_Coursestate_Enum.Denied:
                return t('single.banner.rejected.info');
            default:
                return 'Test';
        }
    }, [courseState]);

    if (isCourseCancelled) return null;

    const isCourseAllowed = courseState === Course_Coursestate_Enum.Allowed;

    return (
        <div className="flex flex-col items-start bg-white border border-gray-300 justify-between max-w-[650px] p-4 rounded-lg md:flex-row md:items-center">
            <div className="flex mb-3 md:mb-0">
                <Typography className="font-bold">{t('single.banner.state')}</Typography>
                <Typography className="ml-1 mr-2">{stateText}</Typography>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="none" size="auto">
                                <IconInfoCircleFilled />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="w-80">{!isPublished ? stateTooltipText : t('single.banner.allowedAndPublished.info')}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {courseState !== Course_Coursestate_Enum.Submitted && (
                <Button className="w-full md:w-fit" variant={isCourseAllowed ? 'ghost' : 'outline'} onClick={handleButtonClick}>
                    {stateButtonText}
                </Button>
            )}
        </div>
    );
};

export default CourseBanner;
