import { gql } from './../gql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Tooltip, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTimeDifference } from '../helper/notification-helper';

type Props = {
    subcourseId: number;
};

const promoteQuery = gql(`
query Subcourse($subcourseId: Int!) {
	subcourse (subcourseId: $subcourseId) {
    id
    courseId
    maxParticipants
    participantsCount
    capacity
    published
    publishedAt
    alreadyPromoted
  }
}, `);

const mutation = gql(`
    mutation subcoursePromote($subcourseId: Float!) {
        subcoursePromote(subcourseId: $subcourseId)
    }
`);

const PromoteButton: React.FC<Props> = ({ subcourseId }) => {
    const [isPromotionButtonDisabled, setIsPromotionButtonDisabled] = useState<boolean>();
    const { sizes } = useTheme();
    const toast = useToast();
    const { t } = useTranslation();
    const { data, loading, refetch } = useQuery(promoteQuery, { variables: { subcourseId: subcourseId } });
    const [promote] = useMutation(mutation, { variables: { subcourseId: subcourseId } });

    const { alreadyPromoted, capacity, publishedAt, published } = data?.subcourse;
    const { daysDiff } = getTimeDifference(publishedAt);

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const doPromote = async () => {
        await promote();
        toast.show({ description: 'Kurs beworben' });
        refetch();
    };

    const isPublishedThreeDaysAgo = (publishDate: string): boolean => {
        const { daysDiff } = getTimeDifference(publishDate);
        if (publishDate === null || daysDiff > 3) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (!alreadyPromoted && capacity < 0.75 && isPublishedThreeDaysAgo(publishedAt)) {
            setIsPromotionButtonDisabled(false);
        } else {
            setIsPromotionButtonDisabled(true);
        }
    }, [alreadyPromoted, capacity, publishedAt, daysDiff]);

    return (
        <div>
            {!loading && published && isPublishedThreeDaysAgo(publishedAt) && (
                <Tooltip label={t('single.buttonPromote.tooltip')} p={3} placement="bottom" hasArrow>
                    <Button width={ButtonContainer} isDisabled={isPromotionButtonDisabled} onPress={doPromote}>
                        {t('single.buttonPromote.button')}
                    </Button>
                </Tooltip>
            )}
        </div>
    );
};

export default PromoteButton;
