import { useTranslation } from 'react-i18next';
import CourseTrafficLamp from './CourseTrafficLamp';
import CheckIcon from '../assets/icons/lernfair/Icon_Done.svg';
import { TrafficStatus } from '../types/lernfair/Course';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';

type BannerProps = {
    courseStatus: TrafficStatus;
    seatsLeft: number;
};

const PupilJoinedCourseBanner = ({ courseStatus, seatsLeft }: BannerProps) => {
    const { t } = useTranslation();

    return (
        <div className="bg-primary-lighter w-full max-w-[460px] p-4 rounded-lg shadow-md">
            <div className="flex flex-col justify-between items-start gap-1">
                <CourseTrafficLamp seatsLeft={seatsLeft} status={courseStatus} paddingY={1} />
                <Separator className="mb-3" />
                <div className="flex items-center">
                    <div className="pr-2">
                        <CheckIcon width={40} />
                    </div>
                    <Typography className="ml-1">{t('single.card.alreadyRegistered')}</Typography>
                </div>
            </div>
        </div>
    );
};

export default PupilJoinedCourseBanner;
