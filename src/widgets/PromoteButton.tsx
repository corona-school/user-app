import { Button, Tooltip, useBreakpointValue, useTheme } from 'native-base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTimeDifference } from '../helper/notification-helper';

type Props = {
    subcourseId: number;
    alreadyPromoted: boolean;
    capacity: number;
    publishedAt: string;
    published: boolean;
    loading: boolean;
    promote: () => void;
};

const PromoteButton: React.FC<Props> = ({ subcourseId, alreadyPromoted, capacity, publishedAt, published, loading, promote }) => {
    const [isPromotionButtonDisabled, setIsPromotionButtonDisabled] = useState<boolean>();
    const { sizes } = useTheme();
    const { t } = useTranslation();

    const { daysDiff } = getTimeDifference(publishedAt);

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

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
        <>
            {!loading && published && isPublishedThreeDaysAgo(publishedAt) && (
                <Tooltip label={t('single.buttonPromote.tooltip')} p={3} placement="bottom" hasArrow>
                    <Button width={ButtonContainer} isDisabled={isPromotionButtonDisabled} onPress={promote}>
                        {t('single.buttonPromote.button')}
                    </Button>
                </Tooltip>
            )}
        </>
    );
};

export default PromoteButton;
