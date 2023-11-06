import { Box, Button, Modal, Stack, Text, VStack, useMediaQuery } from 'native-base';
import { AchievementModalProps, AchievementState } from '../types';
import PolaroidImageContainer from '../polaroid/getPolaroidImage';
import { useTranslation } from 'react-i18next';
import Theme from '../../../Theme';
import IndicatorBar from '../progressIndicators/indicatorBar';
import NewAchievementShine from '../cosmetics/newAchievementShine';
import AchievementBadge from '../achievementBadge';

const AchievementModalMobile: React.FC<AchievementModalProps> = ({
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
    onClose,
}) => {
    const { t } = useTranslation();
    const textColor = achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900];
    const currentStep = steps ? steps.findIndex((step) => step.isActive) + 1 : undefined;

    const [isTablet] = useMediaQuery({
        minWidth: 480,
        minHeight: 768,
    });

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            width={'100vw'}
            height={'100vh'}
            overflow={'hidden'}
            justifyContent={isTablet ? 'center' : 'normal'}
            alignItems={isTablet ? 'center' : 'normal'}
            display={isTablet ? 'grid' : 'flex'}
        >
            <Modal.Body
                height={isTablet ? 'max-content' : '100vh'}
                maxWidth={'550px'}
                backgroundColor={achievementState === AchievementState.COMPLETED ? Theme.colors.primary[900] : Theme.colors.white}
                borderRadius={isTablet ? '8px' : 0}
                flexGrow={0}
            >
                <Modal.CloseButton />
                <Stack width={'100%'} maxWidth={'550px'} height={'100%'} justifyContent={isTablet ? 'center' : 'normal'}>
                    <VStack
                        alignItems={'center'}
                        justifyContent={isTablet ? 'center' : 'normal'}
                        space={'32px'}
                        width={'100%'}
                        maxWidth={'550px'}
                        height={'100%'}
                        overflowX={'hidden'}
                        padding={'32px'}
                        backgroundColor={achievementState === AchievementState.COMPLETED ? Theme.colors.primary[900] : Theme.colors.white}
                    >
                        <Box top={'20px'}>
                            <PolaroidImageContainer
                                image={achievementState === AchievementState.COMPLETED ? image : undefined}
                                alternativeText={alternativeText || ''}
                            />
                            {newAchievement && (
                                <Box position={'absolute'} top={'-40px'} left={'-70px'}>
                                    <NewAchievementShine />
                                </Box>
                            )}
                        </Box>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <Text color={textColor} textAlign={'center'}>
                                {title}
                            </Text>
                            <Text fontSize={'xl'} fontWeight={'bold'} lineHeight={'16px'} textAlign={'center'} color={textColor}>
                                {name}
                            </Text>
                        </div>
                        {achievementState === AchievementState.COMPLETED ? (
                            <Box width={'100%'} display={'flex'} alignItems={'center'}>
                                {newAchievement ? (
                                    <AchievementBadge isInline />
                                ) : (
                                    <Text color={Theme.colors.primary[500]} textAlign={'center'}>
                                        {actionDescription}
                                    </Text>
                                )}
                            </Box>
                        ) : (
                            <Box width={'100%'}>{steps && <IndicatorBar maxSteps={steps.length} currentStep={currentStep} centerText />}</Box>
                        )}
                        <Text width={'100%'} color={textColor}>
                            {description}
                        </Text>
                        {achievementState !== AchievementState.COMPLETED ? (
                            <Stack width={'100%'} display={'flex'} flexDirection={'column'} space={'8px'}>
                                <Button onClick={onClose} variant={'outline'}>
                                    <Text color={Theme.colors.primary[900]}>{t('achievement.modal.close')}</Text>
                                </Button>
                                <Button variant={'outline'}>
                                    <Text color={Theme.colors.primary[900]}>{t('achievement.modal.achievements')}</Text>
                                </Button>
                                <Button variant={'solid'}>
                                    <Text>{buttonText}</Text>
                                </Button>
                            </Stack>
                        ) : (
                            <Stack width={'100%'} display={'flex'} flexDirection={'column'} space={'8px'}>
                                <Button variant={'outlinelight'}>
                                    <Text color={Theme.colors.primary[500]}>{t('achievement.modal.achievements')}</Text>
                                </Button>
                                <Button onClick={onClose} variant={'solid'}>
                                    <Text>{t('achievement.modal.close')}</Text>
                                </Button>
                            </Stack>
                        )}
                    </VStack>
                </Stack>
            </Modal.Body>
        </Modal>
    );
};

export default AchievementModalMobile;
