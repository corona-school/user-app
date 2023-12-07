import { Box, Button, CloseIcon, HStack, Link, Modal, Pressable, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import AchievementImageContainer from '../AchievementImageContainer';
import CheckGreen from '../../../assets/icons/icon_check_green.svg';
import ArrowGreen from '../../../assets/icons/icon_arrow_right_green.svg';
import { AchievementState, AchievementType, PolaroidImageSize, ShineSize } from '../../../types/achievement';
import AchievementBadge from '../AchievementBadge';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import IndicatorBarWithSteps from '../progressIndicators/IndicatorBarWithSteps';

type AchievementModalProps = {
    title: string;
    name: string;
    description: string;
    achievementState: AchievementState;
    achievementType: AchievementType;
    buttonText?: string;
    buttonLink?: string;
    newAchievement?: boolean;
    steps?: {
        description: string;
        isActive?: boolean;
    }[];
    maxSteps?: number;
    currentStep?: number;
    progressDescription?: string;
    image?: string;
    alternativeText?: string;
    onClose?: () => void;
    showModal?: boolean;
};

const AchievementModal: React.FC<AchievementModalProps> = ({
    title,
    name,
    description,
    buttonText,
    buttonLink,
    newAchievement,
    steps,
    maxSteps,
    currentStep,
    progressDescription,
    image,
    alternativeText,
    achievementState,
    achievementType,
    onClose,
    showModal,
}) => {
    const { t } = useTranslation();

    const justifyModalContent = useBreakpointValue({ base: 'normal', md: 'center' });
    const alignModalItems = useBreakpointValue({ base: 'normal', md: 'center' });
    const displayModalItems = useBreakpointValue({ base: 'flex', md: 'grid' });
    const modalBodyWidth = useBreakpointValue({ base: '100%', lg: '820px' });
    const modalBodyMaxWidth = useBreakpointValue({ base: '550px', lg: '820px' });
    const modalBodyHeight = useBreakpointValue({ base: '100vh', md: 'max-content', lg: '434px' });
    const modalBodyBorderRadius = useBreakpointValue({ base: '0', md: '8px' });
    const modalBodyOverflow = useBreakpointValue({ base: 'scroll', lg: 'visible' });
    const modalBodyMarginTop = useBreakpointValue({ base: '0', md: '62px' });
    const contentMaxWidth = useBreakpointValue({ base: '550px', lg: '820px' });
    const contentSpace = useBreakpointValue({ base: 0, lg: 3 });
    const contentJustifyContent = useBreakpointValue({ base: 'normal', md: 'center', lg: 'space-between' });
    const contentMaxHeight = useBreakpointValue({ base: 'fit-content', lg: '275px' });
    const contentDirection = useBreakpointValue({ base: 'column', lg: 'row' });
    const contentInnerSpace = useBreakpointValue({ base: '32px', lg: '0' });
    const contentPadding = useBreakpointValue({ base: '16px', lg: '32px' });
    const imageContainerOffset = useBreakpointValue({ base: { top: '20px' }, lg: { top: '0' } });
    const imageContainerHeight = useBreakpointValue({ base: 'fit-content', lg: '100%' });
    const textBoxWidth = useBreakpointValue({ base: '100%', lg: '473px' });
    const textBoxMaxWidth = useBreakpointValue({ base: '100%', lg: '473px' });
    const textBoxHeight = useBreakpointValue({ base: 'auto', lg: '100%' });
    const textBoxAlignItems = useBreakpointValue({ base: 'center', lg: 'normal' });
    const showBadgeWithTitle = useBreakpointValue({ base: false, lg: true });
    const modalNameFontSize = useBreakpointValue({ base: 'xl', lg: '4xl' });
    const modalNameLineHeight = useBreakpointValue({ base: '26px', lg: '36px' });
    const modalNameTextAlign = useBreakpointValue({ base: 'center', lg: 'left' });
    const showDescriptionBeforeIndicator = useBreakpointValue({ base: false, lg: true });
    const buttonAlignment = useBreakpointValue({ base: 'column', lg: 'row' });

    const shineSize = useBreakpointValue({
        base: ShineSize.SMALL,
        md: ShineSize.MEDIUM,
        lg: ShineSize.LARGE,
    });
    const polaroidImageSize = useBreakpointValue({
        base: { width: PolaroidImageSize.MEDIUM, height: `calc(${PolaroidImageSize.MEDIUM} * 1.4)` },
        md: { width: PolaroidImageSize.LARGE, height: `calc(${PolaroidImageSize.LARGE} * 1.4)` },
    });

    const activeStep = steps ? steps.findIndex((step) => step.isActive) + 1 : 0;
    const backgroundColor = achievementState === AchievementState.COMPLETED || achievementType === AchievementType.STREAK ? 'primary.900' : 'white';
    const textColor = achievementState === AchievementState.COMPLETED || achievementType === AchievementType.STREAK ? 'white' : 'primary.900';
    return (
        <Modal
            isOpen={showModal}
            onClose={onClose}
            width="100vw"
            height="100vh"
            justifyContent={justifyModalContent}
            alignItems={alignModalItems}
            display={displayModalItems}
        >
            <Modal.Body
                width={modalBodyWidth}
                maxWidth={modalBodyMaxWidth}
                height={modalBodyHeight}
                backgroundColor={backgroundColor}
                borderRadius={modalBodyBorderRadius}
                marginTop={achievementType === AchievementType.TIERED && achievementState === AchievementState.COMPLETED && modalBodyMarginTop}
                overflow={modalBodyOverflow}
            >
                <Box position="absolute" zIndex="1" right="20px" top="14px">
                    <Pressable onPress={onClose}>
                        <CloseIcon
                            color={achievementState === AchievementState.COMPLETED || achievementType === AchievementType.STREAK ? 'white' : 'grey.500'}
                        />
                    </Pressable>
                </Box>
                <VStack width="100%" maxWidth={contentMaxWidth} height="100%" space={contentSpace} justifyContent={contentJustifyContent}>
                    <VStack width="100%" maxWidth={modalBodyMaxWidth} height={contentMaxHeight}>
                        <Stack
                            width="100%"
                            maxWidth={modalBodyMaxWidth}
                            height={contentMaxHeight}
                            direction={contentDirection}
                            space={contentInnerSpace}
                            alignItems="center"
                            justifyContent={contentJustifyContent}
                            padding={contentPadding}
                            marginBottom={contentSpace}
                        >
                            <VStack
                                top={achievementState === AchievementState.COMPLETED && imageContainerOffset.top}
                                left={achievementType === AchievementType.STREAK && imageContainerOffset.left}
                                alignItems="center"
                                height={imageContainerHeight}
                            >
                                <AchievementImageContainer
                                    image={achievementType === AchievementType.TIERED && achievementState !== AchievementState.COMPLETED ? undefined : image}
                                    alternativeText={alternativeText || ''}
                                    achievementType={achievementType}
                                    achievementState={achievementState}
                                    streak={steps ? steps.length : maxSteps}
                                    isRecord={maxSteps === currentStep}
                                    isLarge
                                />
                                {newAchievement && (
                                    <VStack position="absolute" width="fit-content" height={polaroidImageSize.width} justifyContent="flex-end">
                                        <Box width={polaroidImageSize.width} height={polaroidImageSize.height}>
                                            <NewAchievementShine size={shineSize} isLarge />
                                        </Box>
                                    </VStack>
                                )}
                            </VStack>
                            <VStack width={textBoxWidth} space={3} maxWidth={textBoxMaxWidth} height={textBoxHeight} alignItems={textBoxAlignItems}>
                                {!showBadgeWithTitle ? (
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
                                    fontSize={modalNameFontSize}
                                    fontWeight="bold"
                                    lineHeight={modalNameLineHeight}
                                    textAlign={modalNameTextAlign}
                                    color={textColor}
                                >
                                    {name}
                                </Text>
                                {showDescriptionBeforeIndicator && (
                                    <Text color={textColor} numberOfLines={7}>
                                        {description}
                                    </Text>
                                )}
                            </VStack>
                            {!showDescriptionBeforeIndicator && (
                                <VStack width="100%" alignItems="center" space="8">
                                    <Box width="80%">
                                        {achievementState === AchievementState.COMPLETED ? (
                                            <Box width="100%" display="flex" alignItems="center">
                                                {newAchievement ? (
                                                    <AchievementBadge isInline />
                                                ) : (
                                                    <Text color="primary.500" textAlign="center">
                                                        {progressDescription}
                                                    </Text>
                                                )}
                                            </Box>
                                        ) : (
                                            <Box width="100%">
                                                {(achievementType === AchievementType.TIERED || achievementType === AchievementType.STREAK) && maxSteps ? (
                                                    <IndicatorBar maxSteps={maxSteps} currentStep={currentStep} centerText fullWidth largeText />
                                                ) : (
                                                    <Box width="100%">
                                                        {steps && (
                                                            <IndicatorBar
                                                                maxSteps={steps?.length || 0}
                                                                currentStep={activeStep}
                                                                achievementType={achievementType}
                                                                largeText
                                                                centerText
                                                                fullWidth
                                                            />
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                    <Text width="100%" color={textColor} fontSize="12px">
                                        {description}
                                    </Text>
                                </VStack>
                            )}
                        </Stack>
                        {showDescriptionBeforeIndicator && (
                            <Box>
                                {achievementType === AchievementType.SEQUENTIAL && (
                                    <Box width="100%">
                                        {steps && <IndicatorBarWithSteps maxSteps={steps.length} steps={steps} achievementState={achievementState} />}
                                    </Box>
                                )}
                                {(achievementType === AchievementType.TIERED || achievementType === AchievementType.STREAK) && maxSteps && (
                                    <Box width="100%">
                                        {<IndicatorBar maxSteps={maxSteps} currentStep={currentStep} achievementType={achievementType} fullWidth largeText />}
                                    </Box>
                                )}
                            </Box>
                        )}
                        {!steps && !maxSteps && progressDescription && (
                            <HStack alignItems={'center'} space={'sm'}>
                                {achievementState === AchievementState.COMPLETED ? (
                                    <CheckGreen />
                                ) : (
                                    <Box width={'10px'} height={'10px'}>
                                        <ArrowGreen />
                                    </Box>
                                )}
                                <Text fontSize={'14px'} color="primary.500">
                                    {progressDescription}
                                </Text>
                            </HStack>
                        )}
                    </VStack>
                    {buttonLink && buttonText && achievementState !== AchievementState.COMPLETED ? (
                        <Stack width="100%" direction={buttonAlignment} space={2} paddingTop="2">
                            <Button flex={1} variant="outline" onPress={onClose}>
                                <Text color="primary.500">{t('achievement.modal.close')}</Text>
                            </Button>
                            <Button flex={1} variant="outline">
                                <Text color="primary.500">{t('achievement.modal.achievements')}</Text>
                            </Button>
                            <Link href={buttonLink} flex={1} backgroundColor="secondary.900" borderRadius={4} justifyContent="center" alignItems="center">
                                <Text>{buttonText}</Text>
                            </Link>
                        </Stack>
                    ) : (
                        <Stack width="100%" direction={buttonAlignment} space={2} paddingTop="2">
                            <Button flex={1} variant="outlinelight">
                                <Text color="primary.500">{t('achievement.modal.achievements')}</Text>
                            </Button>
                            <Button flex={1} variant="solid" onPress={onClose}>
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
