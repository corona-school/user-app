import { ChevronDownIcon, HStack, Text, useBreakpointValue, Box, Link, PresenceTransition } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AchievementState, AchievementType } from '../../types/achievement';
import { useMemo, useState } from 'react';
import { Pressable } from 'react-native';

type ProgressCollapsableHeadlineProps = {
    achievementState?: AchievementState;
    achievementType?: AchievementType;
    onClick: () => void;
};

const ProgressCollapsableHeadline: React.FC<ProgressCollapsableHeadlineProps> = ({ achievementState, achievementType, onClick }) => {
    const { t } = useTranslation();
    const [isRotated, setIsRotated] = useState(false);
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
    }, [achievementState, achievementType]);
    const isCollapsable = useBreakpointValue({
        base: true,
        md: false,
    });
    const handlePress = () => {
        if (isCollapsable) {
            setIsRotated(!isRotated);
            onClick();
        }
    };
    return (
        <Pressable
            onPress={handlePress}
            style={{
                width: '100%',
                flexDirection: 'column',
            }}
            disabled={!isCollapsable}
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
                        <PresenceTransition
                            visible={isRotated}
                            initial={{
                                rotate: '0deg',
                            }}
                            animate={{
                                rotate: '180deg',
                                transition: {
                                    duration: 250,
                                },
                            }}
                        >
                            <ChevronDownIcon />
                        </PresenceTransition>
                    </HStack>
                ) : (
                    <Text fontSize="md" fontWeight="bold">
                        {headline}
                    </Text>
                )}
            </HStack>
        </Pressable>
    );
};

export default ProgressCollapsableHeadline;
