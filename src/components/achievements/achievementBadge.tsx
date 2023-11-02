import { Stack, Text } from 'native-base';
import Trophy from '../../assets/icons/icon_trophy.svg';
import Theme from '../../Theme';
import { useTranslation } from 'react-i18next';

const AchievementBadge: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                position: 'absolute',
                top: '-15px',
                left: '15px',
            }}
        >
            <Stack
                direction={'row'}
                space={1}
                alignItems={'center'}
                backgroundColor={Theme.colors.secondary[900]}
                width={'fit-content'}
                height={'fit-content'}
                borderRadius={'4px'}
                padding={'4px'}
            >
                <Trophy />
                <Text fontSize="xs" color={Theme.colors['primary']['900']} bold>
                    {t('achievement.card.newAchievement')}
                </Text>
            </Stack>
        </div>
    );
};

export default AchievementBadge;
