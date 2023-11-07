import { Box, Button, HStack, Modal, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import Theme from '../../../Theme';
import { useTranslation } from 'react-i18next';
import PolaroidImageContainer from '../polaroid/PolaroidImageContainer';
import { AchievementModalProps, AchievementState } from '../types';
import AchievementBadge from '../AchievementBadge';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import { useState } from 'react';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import IndicatorBarWithSteps from '../progressIndicators/IndicatorBarWithSteps';

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
    const [showModal, setShowModal] = useState(true);

    const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
    const isTablet = useBreakpointValue({ md: true, lg: false });

    const currentStep = steps ? steps.findIndex((step) => step.isActive) + 1 : 0;
    const textColor = achievementState === AchievementState.COMPLETED ? 'white' : 'primary.900';
    return (
        <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            width="100vw"
            height="100vh"
            justifyContent={isMobile ? 'normal' : 'center'}
            alignItems={isMobile ? 'normal' : 'center'}
            display={isMobile ? 'flex' : 'grid'}
        >
            <Modal.Body
                width={isMobile || isTablet ? '100%' : '820px'}
                maxWidth={isMobile || isTablet ? '550px' : '820px'}
                height={isMobile ? '100vh' : isTablet ? 'max-content' : '434px'}
                backgroundColor={`${achievementState === AchievementState.COMPLETED ? 'primary.900' : 'white'}`}
                borderRadius={isMobile ? '0' : '8px'}
                marginTop={achievementState === AchievementState.COMPLETED && !isMobile && !isTablet ? '62px' : 0}
                overflow={isMobile || isTablet ? 'scroll' : 'visible'}
            >
                <Modal.CloseButton />
                <VStack
                    width="100%"
                    maxWidth={isMobile || isTablet ? '550px' : '820px'}
                    height="100%"
                    space={isMobile || isTablet ? 0 : 3}
                    justifyContent={isMobile ? 'normal' : isTablet ? 'center' : 'space-between'}
                >
                    <VStack width="100%" maxWidth={isMobile || isTablet ? '550px' : '820px'} height={isMobile || isTablet ? 'fit-content' : '275px'}>
                        <Stack
                            width="100%"
                            maxWidth={isMobile || isTablet ? '550px' : '820px'}
                            height={isMobile || isTablet ? 'fit-content' : '275px'}
                            direction={isMobile || isTablet ? 'column' : 'row'}
                            space={isMobile || isTablet ? '32px' : 0}
                            alignItems={isMobile || isTablet ? 'center' : 'normal'}
                            justifyContent={isMobile ? 'normal' : isTablet ? 'center' : 'space-between'}
                            padding={isMobile || isTablet ? '16px' : '32px'}
                            marginBottom={isMobile || isTablet ? 0 : 3}
                        >
                            <Box top={isMobile || isTablet ? '20px' : '0'}>
                                <Box marginLeft={isMobile || isTablet ? 0 : '64px'} width={isMobile || isTablet ? '100%' : '142px'}>
                                    <PolaroidImageContainer
                                        image={achievementState === AchievementState.COMPLETED ? image : undefined}
                                        alternativeText={alternativeText || ''}
                                        isLarge={!isMobile && !isTablet}
                                    />
                                </Box>
                                {newAchievement && (
                                    <Box position="absolute" top="-40px" left={isMobile || isTablet ? '-70px' : '-40px'}>
                                        <NewAchievementShine isLarge={!isMobile && !isTablet} />
                                    </Box>
                                )}
                            </Box>
                            <VStack
                                width={isMobile || isTablet ? '100%' : '555px'}
                                space={3}
                                paddingLeft={isMobile || isTablet ? 0 : 16}
                                maxWidth={isMobile || isTablet ? '100%' : '555px'}
                                height={isMobile || isTablet ? 'auto' : '245px'}
                                alignItems={isMobile || isTablet ? 'center' : 'normal'}
                            >
                                {isMobile || isTablet ? (
                                    <Text color={textColor} textAlign="center">
                                        {title}
                                    </Text>
                                ) : (
                                    <HStack alignItems="center" space="12px" height="20px">
                                        {newAchievement && <AchievementBadge isInline />}
                                        <Text color={textColor}>{title}</Text>
                                    </HStack>
                                )}
                                <Text
                                    fontSize={isMobile || isTablet ? 'xl' : '4xl'}
                                    fontWeight="bold"
                                    lineHeight={isMobile || isTablet ? '16px' : '36px'}
                                    textAlign={isMobile || isTablet ? 'center' : 'left'}
                                    color={textColor}
                                >
                                    {name}
                                </Text>
                                {!isMobile && !isTablet && (
                                    <Text color={textColor} numberOfLines={7}>
                                        {description}
                                    </Text>
                                )}
                            </VStack>
                            {(isMobile || isTablet) && (
                                <Box>
                                    {achievementState === AchievementState.COMPLETED ? (
                                        <Box width="100%" display="flex" alignItems="center">
                                            {newAchievement ? (
                                                <AchievementBadge isInline />
                                            ) : (
                                                <Text color={Theme.colors.primary[500]} textAlign="center">
                                                    {actionDescription}
                                                </Text>
                                            )}
                                        </Box>
                                    ) : (
                                        <Box width={'100%'}>{steps && <IndicatorBar maxSteps={steps.length} currentStep={currentStep} centerText />}</Box>
                                    )}
                                </Box>
                            )}
                            {(isMobile || isTablet) && (
                                <Text width={'100%'} color={textColor}>
                                    {description}
                                </Text>
                            )}
                        </Stack>
                        {!isMobile && !isTablet && steps && <IndicatorBarWithSteps maxSteps={steps.length} steps={steps} />}
                    </VStack>
                    {achievementState !== AchievementState.COMPLETED ? (
                        <Stack width="100%" flexDirection={isMobile || isTablet ? 'column' : 'row'} space="8px">
                            <Button flex={1} variant="outline" onPress={() => setShowModal(false)}>
                                <Text color={Theme.colors.primary[500]}>{t('achievement.modal.close')}</Text>
                            </Button>
                            <Button flex={1} variant="outline">
                                <Text color={Theme.colors.primary[500]}>{t('achievement.modal.achievements')}</Text>
                            </Button>
                            <Button flex={1} variant="solid">
                                <Text>{buttonText}</Text>
                            </Button>
                        </Stack>
                    ) : (
                        <Stack width="100%" flexDirection={isMobile || isTablet ? 'column' : 'row'} space="8px">
                            <Button flex={1} variant="outlinelight">
                                <Text color={Theme.colors.primary[500]}>{t('achievement.modal.achievements')}</Text>
                            </Button>
                            <Button flex={1} variant="solid" onPress={() => setShowModal(false)}>
                                <Text>{t('achievement.modal.close')}</Text>
                            </Button>
                        </Stack>
                    )}
                </VStack>
            </Modal.Body>
        </Modal>
    );
};

export default AchievementModal;
