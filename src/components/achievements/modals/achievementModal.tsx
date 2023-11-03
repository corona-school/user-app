import { Box, Button, Row, Stack, Text } from 'native-base';
import Theme from '../../../Theme';
import IndicatorBarWithSteps from '../progressIndicators/indicatorBarWithSteps';
import { useTranslation } from 'react-i18next';
import PolaroidImageContainer from '../polaroid/getPolaroidImage';
import { AchievementModalProps, AchievementState } from '../types';
import AchievementBadge from '../achievementBadge';
import NewAchievementShine from '../cosmetics/newAchievementShine';

const AchievementModal: React.FC<AchievementModalProps> = ({
    title,
    name,
    description,
    buttonText,
    newAchievement,
    steps,
    actionDescription,
    image,
    alternativeText,
    achievementState,
}) => {
    const { t } = useTranslation();
    const textColor = achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900];
    return (
        <div
            style={{
                backgroundColor: `${achievementState === AchievementState.COMPLETED ? Theme.colors.primary[900] : Theme.colors.white}`,
                boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)',
                padding: '32px',
                borderRadius: '8px',
                maxWidth: '820px',
                height: '434px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Box height={'290px'} display={'flex'} flexDirection={'column'} justifyContent={'space-between'} marginBottom={'24px'}>
                <Box width={'100%'} display={'flex'} flexDirection={'row'}>
                    <Box flex={1}>
                        <Box left={'80px'}>
                            <PolaroidImageContainer
                                image={achievementState === AchievementState.COMPLETED ? image : undefined}
                                alternativeText={alternativeText || ''}
                                isLarge
                            />
                        </Box>
                        {newAchievement && (
                            <Box position={'absolute'} top={'-40px'} left={'-40px'}>
                                <NewAchievementShine isLarge />
                            </Box>
                        )}
                    </Box>
                    <Stack flex={2.2} display={'flex'} flexDirection={'column'} space={'12px'} width={'inherit'} paddingLeft={'12px'}>
                        <Row display={'flex'} flexDirection={'row'} alignItems={'center'} space={'12px'} height={'20px'}>
                            {newAchievement && <AchievementBadge isInline />}
                            <Text color={textColor}>{title}</Text>
                        </Row>
                        <Text fontSize={'4xl'} fontWeight={'bold'} lineHeight={'36px'} color={textColor}>
                            {name}
                        </Text>
                        <Text width={'100%'} color={textColor}>
                            {description}
                        </Text>
                    </Stack>
                </Box>
                {steps && <IndicatorBarWithSteps maxSteps={steps.length} steps={steps} achievementState={achievementState} />}
            </Box>
            {buttonText ? (
                <Button.Group width={'100%'} display={'flex'} flexDirection={'row'}>
                    <Button flex={1} variant={achievementState === AchievementState.COMPLETED ? 'outlinelight' : 'outline'}>
                        {t('achievement.modal.close')}
                    </Button>
                    <Button flex={1} variant={achievementState === AchievementState.COMPLETED ? 'outlinelight' : 'outline'}>
                        {t('achievement.modal.achievements')}
                    </Button>
                    <Button flex={1} variant={'solid'}>
                        {buttonText}
                    </Button>
                </Button.Group>
            ) : (
                <Button.Group width={'100%'} display={'flex'} flexDirection={'row'}>
                    <Button flex={1} variant={achievementState === AchievementState.COMPLETED ? 'outlinelight' : 'outline'}>
                        {t('achievement.modal.achievements')}
                    </Button>
                    <Button flex={1} variant={'solid'}>
                        {t('achievement.modal.close')}
                    </Button>
                </Button.Group>
            )}
        </div>
    );
};

export default AchievementModal;
