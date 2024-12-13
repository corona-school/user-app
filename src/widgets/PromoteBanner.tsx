import CheckIcon from '../assets/icons/lernfair/Icon_Done.svg';
import CallIcon from '../assets/icons/lernfair/Icon_Call.svg';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import { Subcourse } from 'gql/graphql';
import { toast } from 'sonner';
import { useState } from 'react';

interface PromoteBannerProps {
    onPromoted: () => Promise<void>;
    subcourse: Pick<Subcourse, 'id' | 'wasPromotedByInstructor'>;
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

    const { wasPromotedByInstructor } = subcourse;

    return (
        <div className="bg-primary-lighter w-full max-w-[460px] p-4 rounded-lg shadow-md">
            <div className="flex flex-col justify-between items-center gap-1">
                <div className="flex flex-row items-center gap-2 lg:gap-4">
                    <div>{wasPromotedByInstructor ? <CheckIcon className="size-9 lg:size-10" /> : <CallIcon className="size-9 lg:size-10" />}</div>
                    <Typography variant="form" className="font-bold">
                        {wasPromotedByInstructor ? t('single.bannerPromote.promotedTitle') : t('single.bannerPromote.freeTitle')}
                    </Typography>
                </div>
                <Typography className="text-center mb-4">
                    {wasPromotedByInstructor ? t('single.bannerPromote.promotedDescription') : t('single.bannerPromote.freeDescription')}
                </Typography>
                {!wasPromotedByInstructor && (
                    <Button className="min-w-48 w-full md:w-fit" isLoading={isPromoting || isLoading} onClick={handleOnPromote}>
                        {t('single.buttonPromote.button')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PromoteBanner;
