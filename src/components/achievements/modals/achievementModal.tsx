import { Box, Button, HStack, Modal, Text, VStack } from 'native-base';
import Theme from '../../../Theme';
import IndicatorBarWithSteps from '../progressIndicators/indicatorBarWithSteps';
import { useTranslation } from 'react-i18next';
import PolaroidImageContainer from '../polaroid/getPolaroidImage';
import { AchievementModalProps, AchievementState } from '../types';
import AchievementBadge from '../achievementBadge';
import NewAchievementShine from '../cosmetics/newAchievementShine';
import { useState } from 'react';

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

    const textColor = achievementState === AchievementState.COMPLETED ? Theme.colors.white : Theme.colors.primary[900];
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} width={'100vw'} height={'100vh'}>
            <Modal.Body
                width={'820px'}
                height={'434px'}
                backgroundColor={`${achievementState === AchievementState.COMPLETED ? Theme.colors.primary[900] : Theme.colors.white}`}
                borderRadius={'8px'}
                top={achievementState === AchievementState.COMPLETED ? '62px' : 0}
            >
                <Modal.CloseButton />
                <VStack width={'100%'} height={'100%'} space={3} justifyContent={'space-between'}>
                    <VStack width={'inherit'} height={'275px'} justifyContent={'space-between'} marginBottom={3}>
                        <HStack width={'100%'}>
                            <Box>
                                <Box marginLeft={'64px'} width={'142px'}>
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
                            <VStack width={'555px'} space={3} paddingLeft={16} maxW={'100%'} height={'245px'}>
                                <HStack alignItems={'center'} space={'12px'} height={'20px'}>
                                    {newAchievement && <AchievementBadge isInline />}
                                    <Text color={textColor}>{title}</Text>
                                </HStack>
                                <Text fontSize={'4xl'} fontWeight={'bold'} lineHeight={'36px'} color={textColor}>
                                    {name}
                                </Text>
                                <Text color={textColor} numberOfLines={7} overflow={'hidden'}>
                                    {description}
                                </Text>
                            </VStack>
                        </HStack>
                        {steps && <IndicatorBarWithSteps maxSteps={steps.length} steps={steps} achievementState={achievementState} />}
                    </VStack>
                    {achievementState !== AchievementState.COMPLETED ? (
                        <Button.Group width={'100%'} display={'flex'} flexDirection={'row'}>
                            <Button flex={1} variant={'outline'} onPress={() => setShowModal(false)}>
                                <Text color={Theme.colors.primary[500]}>{t('achievement.modal.close')}</Text>
                            </Button>
                            <Button flex={1} variant={'outline'}>
                                <Text color={Theme.colors.primary[500]}>{t('achievement.modal.achievements')}</Text>
                            </Button>
                            <Button flex={1} variant={'solid'}>
                                <Text>{buttonText}</Text>
                            </Button>
                        </Button.Group>
                    ) : (
                        <Button.Group width={'100%'} display={'flex'} flexDirection={'row'}>
                            <Button flex={1} variant={'outlinelight'}>
                                <Text color={Theme.colors.primary[500]}>{t('achievement.modal.achievements')}</Text>
                            </Button>
                            <Button flex={1} variant={'solid'} onPress={() => setShowModal(false)}>
                                <Text>{t('achievement.modal.close')}</Text>
                            </Button>
                        </Button.Group>
                    )}
                </VStack>
            </Modal.Body>
        </Modal>
    );
};

export default AchievementModal;
