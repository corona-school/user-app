import { Badge, HStack, Text, useBreakpointValue } from 'native-base';
import Trophy from '../../assets/icons/icon_trophy.svg';
import { useTranslation } from 'react-i18next';

type AchievementBadgeProps = {
    isInline?: boolean;
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ isInline }) => {
    const { t } = useTranslation();
    const offsetLeft = useBreakpointValue({ base: 'auto', md: '15px' });
    const offsetRight = useBreakpointValue({ base: '15px', md: 'auto' });
    return (
        <Badge
            zIndex={1}
            position="absolute"
            top="-15px"
            left={offsetLeft}
            right={offsetRight}
            backgroundColor="secondary.900"
            style={[
                {
                    shadowColor: '#000000',
                    shadowOpacity: 0.25,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    position: `${isInline ? 'relative' : 'absolute'}`,
                },
                isInline && {
                    top: 0,
                    left: 0,
                    right: 0,
                },
            ]}
        >
            <Text fontSize="xs" color="primary.900" bold>
                <HStack alignItems="center" space="4px">
                    <Trophy />
                    {t('achievement.card.newAchievement')}
                </HStack>
            </Text>
        </Badge>
    );
};

export default AchievementBadge;
