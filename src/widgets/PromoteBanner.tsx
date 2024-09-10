import CourseTrafficLamp from './CourseTrafficLamp';
import CheckIcon from '../assets/icons/lernfair/Icon_Done.svg';
import CallIcon from '../assets/icons/lernfair/Icon_Call.svg';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import { Subcourse } from 'gql/graphql';
import { getTrafficStatus } from '@/Utility';
import { toast } from 'sonner';
import { useState } from 'react';

interface PromoteBannerProps {
    onPromoted: () => Promise<void>;
    subcourse: Pick<Subcourse, 'id' | 'maxParticipants' | 'participantsCount' | 'wasPromotedByInstructor'>;
}

const PROMOTE_MUTATION = gql(`
    mutation subcoursePromote($subcourseId: Float!) {
        subcoursePromote(subcourseId: $subcourseId)
    }
`);

const PromoteBanner = ({ onPromoted, subcourse }: PromoteBannerProps) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [promote, { loading: isPromoting }] = useMutation(PROMOTE_MUTATION, { variables: { subcourseId: subcourse.id } });

    const handleOnPromote = async () => {
        try {
            setIsLoading(true);
            await promote();
            toast.success(t('single.buttonPromote.toast'));
            await onPromoted();
        } catch (error) {
            toast.error(t('single.buttonPromote.toastFail'));
        } finally {
            setIsLoading(false);
        }
    };

    const { wasPromotedByInstructor, maxParticipants, participantsCount } = subcourse;
    const status = getTrafficStatus(participantsCount, maxParticipants);

    return (
        <div className="bg-primary-lighter max-w-2xl p-4 pt-2 rounded-lg shadow-md">
            <CourseTrafficLamp showLastSeats seatsFull={participantsCount} seatsMax={maxParticipants} status={status} paddingY={3} />
            <Separator />
            <div className="flex flex-col justify-between py-4 pt-6 items-start gap-1 md:flex-row md:items-center">
                <div className="flex flex-row items-start mb-2 gap-4">
                    <div className="pr-2">{wasPromotedByInstructor ? <CheckIcon /> : <CallIcon />}</div>
                    <div className="flex max-w-[300] flex-col md:max-w-full">
                        <Typography className="font-bold">
                            {wasPromotedByInstructor ? t('single.bannerPromote.promotedTitle') : t('single.bannerPromote.freeTitle')}
                        </Typography>
                        <Typography>
                            {wasPromotedByInstructor ? t('single.bannerPromote.promotedDescription') : t('single.bannerPromote.freeDescription')}
                        </Typography>
                    </div>
                </div>
                {!wasPromotedByInstructor && (
                    <Button className="w-full md:w-fit" isLoading={isPromoting || isLoading} onClick={handleOnPromote}>
                        {t('single.buttonPromote.button')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PromoteBanner;
