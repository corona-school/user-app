import { Badge, HStack, Text } from 'native-base';
import Trophy from '../../assets/icons/icon_trophy.svg';
import { useTranslation } from 'react-i18next';

type AchievementBadgeProps = {
    isMobile?: boolean;
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ isMobile }) => {
    const { t } = useTranslation();
    return (
        <Badge
            position="absolute"
            top="-15px"
            left={isMobile ? 'auto' : '15px'}
            right={isMobile ? '15px' : 'auto'}
            backgroundColor="secondary.900"
            style={{
                shadowColor: '#000000',
                shadowOpacity: 0.25,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
            }}
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
