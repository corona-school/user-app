import { gql, useMutation, useQuery } from '@apollo/client';
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
    courseCapacity
    published
    publishedAt
    alreadyPromoted
  }
}, `);

const promoteMutation = gql(`
    mutation PromoteSubcourse($subcourseId: Float!) {
        promoteSubcourse(subcourseId: $subcourseId)
    }
`);

const PromoteButton: React.FC<Props> = ({ subcourseId }) => {
    const [isPromotionButtonDisabled, setIsPromotionButtonDisabled] = useState<boolean>();
    const { sizes } = useTheme();
    const toast = useToast();
    const { t } = useTranslation();

    const { data, loading, refetch } = useQuery(promoteQuery, { variables: { subcourseId: subcourseId } });

    const [promote] = useMutation(promoteMutation, { variables: { subcourseId: subcourseId } });

    const alreadyPromoted = data?.subcourse?.alreadyPromoted;
    const courseCapacity = data?.subcourse?.courseCapacity;
    const publishedAt = data?.subcourse?.publishedAt;
    const { daysDiff } = getTimeDifference(publishedAt);

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    async function doPromote() {
        await promote();
        toast.show({ description: 'Kurs beworben' });
        refetch();
    }

    useEffect(() => {
        if (alreadyPromoted == false && courseCapacity < 0.75 && (publishedAt === null || daysDiff > 3)) {
            setIsPromotionButtonDisabled(false);
        } else {
            setIsPromotionButtonDisabled(true);
        }
    }, [alreadyPromoted, courseCapacity, daysDiff]);

    return (
        <div>
            {!loading && (
                <Tooltip label={t('single.buttonPromote.tooltip')} p={3}>
                    <Button width={ButtonContainer} isDisabled={isPromotionButtonDisabled} onPress={doPromote}>
                        {t('single.buttonPromote.button')}
                    </Button>
                </Tooltip>
            )}
        </div>
    );
};

export default PromoteButton;
