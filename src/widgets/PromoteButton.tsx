import { Button, Tooltip, useBreakpointValue, useTheme } from 'native-base';
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
    const { sizes } = useTheme();
    const { t } = useTranslation();

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

    const canPromoteCourse = () => {
        return !(!alreadyPromoted && capacity < 0.75 && isPublishedThreeDaysAgo(publishedAt));
    };

    return (
        <>
            {published && (
                <Tooltip label={t('single.buttonPromote.tooltip')} p={3} placement="bottom" hasArrow>
                    <Button width={ButtonContainer} isDisabled={loading || canPromoteCourse()} onPress={promote}>
                        {t('single.buttonPromote.button')}
                    </Button>
                </Tooltip>
            )}
        </>
    );
};

export default PromoteButton;
