import { ChevronDownIcon, HStack, Text, useBreakpointValue, Box, Link } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AchievementState, AchievementType } from './types';
import { useMemo } from 'react';

type ProgressCollapsableHeadlineProps = {
    achievementState?: AchievementState;
    achievementType?: AchievementType;
    onClick: () => void;
};

const ProgressCollapsableHeadline: React.FC<ProgressCollapsableHeadlineProps> = ({ achievementState, achievementType, onClick }) => {
    const { t } = useTranslation();
    const headline = useMemo(() => {
        if (achievementType === AchievementType.STREAK) {
            return t('achievement.progress.streak.headline');
        }
        switch (achievementState) {
            case AchievementState.COMPLETED:
                return t('achievement.progress.state.completed');
            case AchievementState.ACTIVE:
                return t('achievement.progress.state.active');
            case AchievementState.INACTIVE:
                return t('achievement.progress.state.inactive');
            default:
                return '';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [achievementState, achievementType]);
    const isCollapsable = useBreakpointValue({
        base: true,
        md: false,
    });
    const handlePress = () => {
        isCollapsable && onClick();
    };
    return (
        <Link
            onPress={handlePress}
            style={{
                width: '100%',
                flexDirection: 'column',
            }}
        >
            <HStack
                width="100%"
                height="100%"
                style={{
                    flex: 1,
                }}
            >
                {isCollapsable ? (
                    <HStack width="100%" justifyContent="space-between" alignItems="center">
                        <Text fontSize="md" fontWeight="bold">
                            {headline}
                        </Text>
                        <Box />
                        <ChevronDownIcon />
                    </HStack>
                ) : (
                    <Text fontSize="md" fontWeight="bold">
                        {headline}
                    </Text>
                )}
            </HStack>
        </Link>
    );
};

export default ProgressCollapsableHeadline;
