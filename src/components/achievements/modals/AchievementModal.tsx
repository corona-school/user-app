import { Box, Button, CloseIcon, HStack, Link, Modal, Pressable, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import { Trans, useTranslation } from 'react-i18next';
import AchievementImageContainer from '../AchievementImageContainer';
import CheckGreen from '../../../assets/icons/icon_check_green.svg';
import ArrowGreen from '../../../assets/icons/icon_arrow_right_green.svg';
import { PolaroidImageSize, ShineSize } from '../../../types/achievement';
import AchievementBadge from '../AchievementBadge';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import IndicatorBarWithSteps from '../progressIndicators/IndicatorBarWithSteps';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import { Achievement_State, Achievement_Type_Enum, Step } from '../../../gql/graphql';
import { useNavigate } from 'react-router-dom';

type AchievementModalProps = {
    title?: string;
    name: string;
    description: string;
    achievementState: Achievement_State;
    achievementType: Achievement_Type_Enum;
    buttonText?: string;
    buttonLink?: string;
    isNewAchievement?: boolean;
    steps?: Step[];
    maxSteps?: number;
    currentStep?: number;
    progressDescription?: string;
    achievedText?: string;
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
    isNewAchievement,
    steps,
    maxSteps,
    currentStep,
    progressDescription,
    achievedText,
    image,
    alternativeText,
    achievementState,
    achievementType,
    onClose,
    showModal,
}) => {
    console.log(steps);
    const { t } = useTranslation();
    const navigate = useNavigate();

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
    const backgroundColor = achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak ? 'primary.900' : 'white';
    const textColor = achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak ? 'white' : 'primary.900';

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
                marginTop={achievementType === Achievement_Type_Enum.Tiered && achievementState === Achievement_State.Completed && modalBodyMarginTop}
                overflow={modalBodyOverflow}
            >
                <Box position="absolute" zIndex="1" right="20px" top="14px">
                    <Pressable onPress={onClose}>
                        <CloseIcon
                            color={achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak ? 'white' : 'grey.500'}
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
                                    record={steps ? steps.length : maxSteps}
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
                            <VStack width={textBoxWidth} space={3} maxWidth={textBoxMaxWidth} height={textBoxHeight} alignItems={textBoxAlignItems}>
                                {!showBadgeWithTitle ? (
                                    <Text color={textColor} textAlign="center">
                                        {title}
                                    </Text>
                                ) : (
                                    <HStack alignItems="center" space="12px" height="20px">
                                        {isNewAchievement && <AchievementBadge isInline />}
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
                                <Text color={textColor} numberOfLines={7}>
                                    <Trans>{description}</Trans>
                                </Text>
                            </VStack>
                            {!showDescriptionBeforeIndicator && (
                                <VStack width="100%" alignItems="center" space="8">
                                    {!steps ? (
                                        <HStack alignItems={'center'} space={'sm'}>
                                            {achievementState === Achievement_State.Completed ? (
                                                <CheckGreen />
                                            ) : (
                                                <Box width={'10px'} height={'10px'}>
                                                    <ArrowGreen />
                                                </Box>
                                            )}
                                            <Text fontSize={'14px'} color="primary.500">
                                                <Trans>{achievementState === Achievement_State.Completed ? achievedText : progressDescription}</Trans>
                                            </Text>
                                        </HStack>
                                    ) : (
                                        <Box width="80%">
                                            {achievementState === Achievement_State.Completed ? (
                                                <Box width="100%" display="flex" alignItems="center">
                                                    {isNewAchievement ? (
                                                        <AchievementBadge isInline />
                                                    ) : (
                                                        <Text color="primary.500" textAlign="center">
                                                            <Trans>
                                                                {achievementState === Achievement_State.Completed ? achievedText : progressDescription}
                                                            </Trans>
                                                        </Text>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Box width="100%">
                                                    {(achievementType === Achievement_Type_Enum.Tiered || achievementType === Achievement_Type_Enum.Streak) &&
                                                    maxSteps ? (
                                                        <IndicatorBar
                                                            maxSteps={maxSteps}
                                                            currentStep={currentStep}
                                                            progressDescription={progressDescription}
                                                            centerText
                                                            fullWidth
                                                            largeText
                                                        />
                                                    ) : (
                                                        <Box width="100%">
                                                            {steps && (
                                                                <IndicatorBar
                                                                    maxSteps={steps?.length || 0}
                                                                    currentStep={activeStep}
                                                                    achievementType={achievementType}
                                                                    progressDescription={progressDescription}
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
                                    )}
                                    <Text width="100%" color={textColor} fontSize="12px">
                                        <Trans>{description}</Trans>
                                    </Text>
                                </VStack>
                            )}
                        </Stack>
                        {showDescriptionBeforeIndicator && (
                            <Box>
                                {achievementType !== Achievement_Type_Enum.Sequential ? (
                                    <Box>
                                        {achievementState === Achievement_State.Completed ? (
                                            <HStack alignItems={'center'} space={'sm'}>
                                                <CheckGreen />
                                                <Text fontSize={'14px'} color="primary.500">
                                                    <Trans>{achievementState === Achievement_State.Completed ? achievedText : progressDescription}</Trans>
                                                </Text>
                                            </HStack>
                                        ) : (
                                            <Box width="100%">
                                                <IndicatorBar
                                                    maxSteps={maxSteps || 0}
                                                    currentStep={currentStep}
                                                    achievementType={achievementType}
                                                    progressDescription={progressDescription}
                                                    fullWidth
                                                    largeText
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Box width="100%">
                                        {steps && <IndicatorBarWithSteps maxSteps={steps.length} steps={steps} achievementState={achievementState} />}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </VStack>
                    {buttonLink && buttonText && achievementState !== Achievement_State.Completed ? (
                        <Stack width="100%" direction={buttonAlignment} space={2} paddingTop="2">
                            <Button flex={1} variant="outline" onPress={onClose}>
                                <Text color="primary.500">{t('achievement.modal.close')}</Text>
                            </Button>
                            <Button flex={1} variant="outline" onPress={() => navigate('/progress')}>
                                <Text color="primary.500">{t('achievement.modal.achievements')}</Text>
                            </Button>
                            <Link href={buttonLink} flex={1} backgroundColor="secondary.900" borderRadius={4} justifyContent="center" alignItems="center">
                                <Text>{buttonText}</Text>
                            </Link>
                        </Stack>
                    ) : (
                        <Stack width="100%" direction={buttonAlignment} space={2} paddingTop="2">
                            <Button flex={1} variant="outlinelight" onPress={() => navigate('/progress')}>
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
