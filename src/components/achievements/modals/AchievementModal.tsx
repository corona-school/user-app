import { Box, Button, CloseIcon, HStack, Modal, Pressable, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import { Trans, useTranslation } from 'react-i18next';
import AchievementImageContainer from '../AchievementImageContainer';
import CheckGreen from '../../../assets/icons/icon_check_green.svg';
import { PolaroidImageSize, ShineSize } from '../../../types/achievement';
import AchievementBadge from '../AchievementBadge';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import IndicatorBarWithSteps from '../progressIndicators/IndicatorBarWithSteps';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import { Achievement_State, Achievement_Type_Enum, Step } from '../../../gql/graphql';
import { useLocation, useNavigate } from 'react-router-dom';
import { Linking } from 'react-native';

type AchievementModalProps = {
    tagline?: string;
    title: string;
    subtitle?: string;
    description: string;
    footer?: string;
    achievementState: Achievement_State;
    achievementType: Achievement_Type_Enum;
    buttonText?: string;
    buttonLink?: string;
    isNewAchievement?: boolean;
    steps: Step[];
    maxSteps?: number;
    currentStep?: number;
    image?: string;
    alternativeText?: string;
    onClose?: () => void;
    showModal?: boolean;
};

/**
 * An Achievement Modal is a User Interface that displays the user's achievements based on their successes.
 */
const AchievementModal: React.FC<AchievementModalProps> = ({
    title,
    tagline,
    subtitle,
    footer,
    description,
    buttonText,
    buttonLink,
    isNewAchievement,
    steps,
    maxSteps,
    currentStep,
    image,
    alternativeText,
    achievementState,
    achievementType,
    onClose,
    showModal,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;

    const justifyModalContent = useBreakpointValue({ base: 'normal', md: 'center' });
    const alignModalItems = useBreakpointValue({ base: 'normal', md: 'center' });
    const displayModalItems = useBreakpointValue({ base: 'flex', md: 'grid' });
    const modalBodyWidth = useBreakpointValue({ base: '100%', lg: '820px' });
    const modalBodyMaxWidth = useBreakpointValue({ base: '550px', lg: '820px' });
    // https://stackoverflow.com/a/72245072
    const modalBodyHeight = useBreakpointValue({ base: '100dvh', lg: 'fit-content' });
    const modalBodyBorderRadius = useBreakpointValue({ base: '0', md: '8px' });
    const modalBodyMarginTop = useBreakpointValue({ base: '0', md: '62px' });
    const contentMaxWidth = useBreakpointValue({ base: '550px', lg: '820px' });
    const contentHeight = useBreakpointValue({ base: '100%', lg: 'fit-content' });
    const contentJustifyContent = useBreakpointValue({ base: 'space-between', md: 'center', lg: 'space-between' });
    const contentDirection = useBreakpointValue({ base: 'column', lg: 'row' });
    const contentInnerSpace = useBreakpointValue({ base: '32px', lg: '0' });
    const contentPadding = useBreakpointValue({ base: '16px', lg: '32px' });
    const imageContainerOffset = useBreakpointValue({ base: { top: '20px' }, lg: { top: '0' } });
    const imageContainerHeight = useBreakpointValue({ base: 'fit-content', lg: '100%' });
    const imageContainerAlignment = useBreakpointValue({ base: 'center', lg: 'flex-start' });
    const textBoxWidth = useBreakpointValue({ base: '100%', lg: '473px' });
    const textBoxMaxWidth = useBreakpointValue({ base: '100%', lg: '473px' });
    const textBoxAlignItems = useBreakpointValue({ base: 'center', lg: 'normal' });
    const showBadgeWithTitle = useBreakpointValue({ base: false, lg: true });
    const modalNameFontSize = useBreakpointValue({ base: 'xl', lg: '4xl' });
    const modalNameLineHeight = useBreakpointValue({ base: '26px', lg: '36px' });
    const modalNameTextAlign = useBreakpointValue({ base: 'center', lg: 'left' });
    const showDescriptionBeforeIndicator = useBreakpointValue({ base: false, lg: true });
    const buttonAlignment = useBreakpointValue({ base: 'column', lg: 'row' });
    const buttonPaddingTop = useBreakpointValue({ base: '2', lg: '5' });

    const shineSize = useBreakpointValue({
        base: ShineSize.SMALL,
        md: ShineSize.MEDIUM,
        lg: ShineSize.LARGE,
    });
    const polaroidImageSize = useBreakpointValue({
        base: { width: PolaroidImageSize.MEDIUM, height: `calc(${PolaroidImageSize.MEDIUM} * 1.4)` },
        md: { width: PolaroidImageSize.LARGE, height: `calc(${PolaroidImageSize.LARGE} * 1.4)` },
    });

    const activeStep = steps.findIndex((step) => step.isActive);
    const backgroundColor = achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak ? 'primary.900' : 'white';
    const textColor = achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak ? 'white' : 'primary.900';

    return (
        <Modal
            isOpen={showModal}
            onClose={onClose}
            width="100vw"
            height="100dvh"
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
                marginTop={achievementType === Achievement_Type_Enum.Tiered && achievementState === Achievement_State.Completed && modalBodyMarginTop}
            >
                <Box position="absolute" zIndex="1" right="20px" top="14px">
                    <Pressable onPress={onClose}>
                        <CloseIcon
                            color={achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak ? 'white' : 'grey.500'}
                        />
                    </Pressable>
                </Box>
                <VStack width="100%" maxWidth={contentMaxWidth} height={contentHeight} justifyContent={contentJustifyContent}>
                    <VStack width="100%" maxWidth={modalBodyMaxWidth} height="fit-content">
                        <Stack
                            width="100%"
                            maxWidth={modalBodyMaxWidth}
                            height="fit-content"
                            direction={contentDirection}
                            space={contentInnerSpace}
                            alignItems={imageContainerAlignment}
                            justifyContent={contentJustifyContent}
                            padding={contentPadding}
                        >
                            <VStack
                                top={achievementState === Achievement_State.Completed && imageContainerOffset.top}
                                left={achievementType === Achievement_Type_Enum.Streak && imageContainerOffset.left}
                                alignItems="center"
                                height={imageContainerHeight}
                            >
                                <AchievementImageContainer
                                    image={
                                        achievementType === Achievement_Type_Enum.Tiered && achievementState !== Achievement_State.Completed ? undefined : image
                                    }
                                    alternativeText={alternativeText || ''}
                                    achievementType={achievementType}
                                    achievementState={achievementState}
                                    record={steps.length > 0 ? steps.length : maxSteps}
                                    isRecord={maxSteps === currentStep}
                                    isLarge
                                />
                                {isNewAchievement && (
                                    <VStack position="absolute" width="fit-content" height={polaroidImageSize.width} justifyContent="flex-end">
                                        <Box width={polaroidImageSize.width} height={polaroidImageSize.height}>
                                            <NewAchievementShine size={shineSize} isLarge />
                                        </Box>
                                    </VStack>
                                )}
                            </VStack>
                            <VStack width={textBoxWidth} space={3} maxWidth={textBoxMaxWidth} alignItems={textBoxAlignItems}>
                                {!showBadgeWithTitle ? (
                                    <Text color={textColor} textAlign="center">
                                        {tagline}
                                    </Text>
                                ) : (
                                    <HStack alignItems="center" space="12px" height="20px">
                                        {isNewAchievement && <AchievementBadge isInline />}
                                        <Text color={textColor}>{tagline}</Text>
                                    </HStack>
                                )}
                                <Text
                                    fontSize={modalNameFontSize}
                                    fontWeight="bold"
                                    lineHeight={modalNameLineHeight}
                                    textAlign={modalNameTextAlign}
                                    color={textColor}
                                >
                                    {title}
                                </Text>
                                {showDescriptionBeforeIndicator && (
                                    <Text color={textColor}>
                                        <Trans>{description}</Trans>
                                    </Text>
                                )}
                            </VStack>
                            {!showDescriptionBeforeIndicator && (
                                <VStack width="100%" alignItems="center" space="8">
                                    <Box width="100%">
                                        {achievementState === Achievement_State.Completed ? (
                                            <Box width="100%" display="flex" alignItems="center">
                                                {isNewAchievement ? (
                                                    <AchievementBadge isInline />
                                                ) : (
                                                    <HStack alignItems={'center'} space={'sm'}>
                                                        {achievementState === Achievement_State.Completed && <CheckGreen />}
                                                        <Text color="primary.500" textAlign="center">
                                                            <Trans>{{ footer }}</Trans>
                                                        </Text>
                                                    </HStack>
                                                )}
                                            </Box>
                                        ) : (
                                            <Box width="100%">
                                                {achievementType === Achievement_Type_Enum.Sequential ? (
                                                    <IndicatorBar
                                                        maxSteps={steps.length}
                                                        currentStep={activeStep}
                                                        progressDescription={footer}
                                                        largeText
                                                        centerText
                                                        fullWidth
                                                    />
                                                ) : (
                                                    <IndicatorBar
                                                        // In case of a streak, we have to reach maxValue + 1
                                                        // Otherwise, max value is desired, like "3 / 5 Termine"
                                                        maxSteps={achievementType === Achievement_Type_Enum.Streak ? (maxSteps || 0) + 1 : maxSteps || 0}
                                                        currentStep={currentStep}
                                                        progressDescription={footer}
                                                        fullWidth
                                                        largeText
                                                    />
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                    <Text width="100%" color={textColor} fontSize="12px">
                                        <Trans>{description}</Trans>
                                    </Text>
                                </VStack>
                            )}
                        </Stack>
                    </VStack>
                    {showDescriptionBeforeIndicator && (
                        <Box height="fit-content">
                            {achievementType !== Achievement_Type_Enum.Sequential ? (
                                <Box height="fit-content">
                                    {achievementState === Achievement_State.Completed ? (
                                        <HStack alignItems="center" space="sm" height="fit-content">
                                            <CheckGreen />
                                            <Text fontSize={'14px'} color="primary.500">
                                                <Trans>{{ footer }}</Trans>
                                            </Text>
                                        </HStack>
                                    ) : (
                                        <Box width="100%" height="fit-content">
                                            <IndicatorBar
                                                // In case of a streak, we have to reach maxValue + 1
                                                // Otherwise, max value is desired, like "3 / 5 Termine"
                                                maxSteps={achievementType === Achievement_Type_Enum.Streak ? (maxSteps || 0) + 1 : maxSteps || 0}
                                                currentStep={currentStep}
                                                progressDescription={footer}
                                                fullWidth
                                                largeText
                                            />
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Box width="100%" height="fit-content">
                                    {steps.length > 0 && <IndicatorBarWithSteps maxSteps={steps.length} steps={steps} achievementState={achievementState} />}
                                </Box>
                            )}
                        </Box>
                    )}
                    {buttonLink && buttonText && achievementState !== Achievement_State.Completed ? (
                        <Stack width="100%" direction={buttonAlignment} space={2} paddingTop={buttonPaddingTop}>
                            <Button flex={1} variant="outline" onPress={onClose}>
                                <Text color="primary.500">{t('achievement.modal.close')}</Text>
                            </Button>
                            <Button
                                flex={1}
                                variant="outline"
                                onPress={() => {
                                    pathname === '/progress' && onClose ? onClose() : navigate('/progress');
                                }}
                            >
                                <Text color="primary.500">{t('achievement.modal.achievements')}</Text>
                            </Button>
                            <Button
                                onPress={() => {
                                    if (buttonLink.startsWith('mailto') || buttonLink.startsWith('http')) {
                                        Linking.openURL(buttonLink);
                                    } else {
                                        navigate(buttonLink);
                                    }
                                }}
                                flex={1}
                                variant="solid"
                            >
                                <Text>{buttonText}</Text>
                            </Button>
                        </Stack>
                    ) : (
                        <Stack width="100%" direction={buttonAlignment} space={2} paddingTop={buttonPaddingTop}>
                            <Button
                                flex={1}
                                variant="outlinelight"
                                onPress={() => {
                                    pathname === '/progress' && onClose ? onClose() : navigate('/progress');
                                }}
                            >
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
