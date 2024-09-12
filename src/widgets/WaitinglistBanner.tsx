import CourseTrafficLamp from './CourseTrafficLamp';
import SandClock from '../assets/icons/lernfair/Icon_SandClock.svg';
import { useTranslation } from 'react-i18next';
import { TrafficStatus } from '../types/lernfair/Course';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

type WaitingListBannerProps = {
    courseStatus: TrafficStatus;
    loading: boolean;
    onLeaveWaitingList: () => void;
};

const WaitingListBanner = ({ courseStatus, loading, onLeaveWaitingList }: WaitingListBannerProps) => {
    const { t } = useTranslation();

    return (
        <div className="bg-primary-lighter w-full max-w-[460px] p-4 rounded-lg shadow-md">
            <div className="flex flex-col justify-between items-start gap-1">
                <CourseTrafficLamp status={courseStatus} paddingY={1} />
                <Separator className="mb-3" />
                <div className="flex flex-col items-start md:flex-row md:items-center gap-y-1 w-full">
                    <div className="flex flex-row items-center mb-2">
                        <div className="pr-2">
                            <SandClock width={40} height={40} />
                        </div>
                        <Typography className="text-balance">{t('single.waitinglist.joinMember')}</Typography>
                    </div>
                    <Button onClick={onLeaveWaitingList} className="w-full md:w-fit" variant="outline" isLoading={loading}>
                        {t('single.waitinglist.leaveWaitinglist')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WaitingListBanner;
