import { Box, Button, HStack, Modal, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import Theme from '../../../Theme';
import { useTranslation } from 'react-i18next';
import AchievementImageContainer from '../AchievementImageContainer';
import CheckGreen from '../../../assets/icons/icon_check_green.svg';
import ArrowGreen from '../../../assets/icons/icon_arrow_right_green.svg';
import { AchievementState, AchievementType } from '../types';
import AchievementBadge from '../AchievementBadge';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import { useState } from 'react';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import IndicatorBarWithSteps from '../progressIndicators/IndicatorBarWithSteps';
import { getShineSize, getPolaroidImageSize } from '../helpers/achievement-image-helper';

type AchievementModalProps = {
    title: string;
    name: string;
    description: string;
    achievementState: AchievementState;
    achievementType: AchievementType;
    buttonText?: string;
    newAchievement?: boolean;
    steps?: {
        description: string;
        isActive?: boolean;
    }[];
    maxSteps?: number;
    currentStep?: number;
    actionDescription?: string;
    achievedText?: string;
    image?: string;
    alternativeText?: string;
    onClose?: () => void;
};

const AchievementModal: React.FC<AchievementModalProps> = ({
    title,
    name,
    description,
    buttonText,
    newAchievement,
    steps,
    maxSteps,
    currentStep,
    actionDescription,
    achievedText,
    image,
    alternativeText,
    achievementState,
    achievementType,
}) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(true);

    const isMobile = useBreakpointValue({ base: true, sm: true, md: false });
    const isTablet = useBreakpointValue({ md: true, lg: false });

    const activeStep = steps ? steps.findIndex((step) => step.isActive) + 1 : 0;
    const backgroundColor = achievementState === AchievementState.COMPLETED || achievementType === AchievementType.STREAK ? 'primary.900' : 'white';
    const textColor = achievementState === AchievementState.COMPLETED || achievementType === AchievementType.STREAK ? 'white' : 'primary.900';
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
                backgroundColor={backgroundColor}
                borderRadius={isMobile ? '0' : '8px'}
                marginTop={achievementType === AchievementType.TIERED && achievementState === AchievementState.COMPLETED && !isMobile && !isTablet ? '62px' : 0}
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
                            alignItems="center"
                            justifyContent={isMobile ? 'normal' : isTablet ? 'center' : 'space-between'}
                            padding={isMobile || isTablet ? '16px' : '32px'}
                            marginBottom={isMobile || isTablet ? 0 : 3}
                        >
                            <Box top={isMobile || isTablet ? '20px' : '0'}>
                                <AchievementImageContainer
                                    image={achievementType === AchievementType.TIERED && achievementState !== AchievementState.COMPLETED ? undefined : image}
                                    alternativeText={alternativeText || ''}
                                    achievementType={achievementType}
                                    streak={steps ? steps.length : maxSteps}
                                    isRecord={maxSteps === currentStep}
                                    isMobile={isMobile}
                                    isTablet={isTablet}
                                    isLarge
                                />
                                {newAchievement && (
                                    <Box position="absolute" width={getPolaroidImageSize(isMobile, isTablet, true)} height="100%">
                                        <NewAchievementShine size={getShineSize(isMobile, isTablet)} />
                                    </Box>
                                )}
                            </Box>
                            <VStack
                                width={isMobile || isTablet ? '100%' : '473px'}
                                space={3}
                                maxWidth={isMobile || isTablet ? '100%' : '473px'}
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
                                <VStack width="100%" alignItems="center" space="8px">
                                    <Box width="80%">
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
                                            <Box width="100%">
                                                {(achievementType === AchievementType.TIERED || achievementType === AchievementType.STREAK) && maxSteps ? (
                                                    <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} centerText />
                                                ) : (
                                                    <Box width="100%">
                                                        {steps && (
                                                            <IndicatorBar
                                                                maxSteps={steps?.length || 0}
                                                                currentStep={activeStep}
                                                                achievementType={achievementType}
                                                                isMobile={isMobile}
                                                                largeText
                                                                centerText
                                                            />
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                    <Text width="100%" color={textColor}>
                                        {description}
                                    </Text>
                                </VStack>
                            )}
                        </Stack>
                        {!isMobile && !isTablet && (
                            <Box>
                                {achievementType === AchievementType.SEQUENTIAL && (
                                    <Box width="100%">
                                        {steps && <IndicatorBarWithSteps maxSteps={steps.length} steps={steps} achievementState={achievementState} />}
                                    </Box>
                                )}
                                {(achievementType === AchievementType.TIERED || achievementType === AchievementType.STREAK) && maxSteps && (
                                    <Box width="100%">{<IndicatorBar maxSteps={maxSteps} currentStep={currentStep} achievementType={achievementType} />}</Box>
                                )}
                            </Box>
                        )}
                        {!steps && !maxSteps && actionDescription && (
                            <HStack alignItems={'center'} space={'sm'}>
                                {achievementState === AchievementState.COMPLETED ? (
                                    <CheckGreen />
                                ) : (
                                    <Box width={'10px'} height={'10px'}>
                                        <ArrowGreen />
                                    </Box>
                                )}
                                <Text fontSize={'14px'} color={Theme.colors.primary[500]}>
                                    {actionDescription}
                                </Text>
                            </HStack>
                        )}
                    </VStack>
                    {achievementState !== AchievementState.COMPLETED ? (
                        <Stack width="100%" direction={isMobile || isTablet ? 'column' : 'row'} space={2}>
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
                        <Stack width="100%" direction={isMobile || isTablet ? 'column' : 'row'} space={2}>
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
