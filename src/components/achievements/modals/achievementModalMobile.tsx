import { Box, Button, Stack, Text, useMediaQuery } from 'native-base';
import { AchievementModalProps, AchievementState } from '../types';
import PolaroidImageContainer from '../polaroid/getPolaroidImage';
import Close from '../../../assets/icons/ic_close.svg';
import CloseWhite from '../../../assets/icons/ic_close_white.svg';
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
        <Box
            width={'100vw'}
            height={'100vh'}
            backgroundColor={'rgba(0, 0, 0, 0.5)'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={isTablet ? 'center' : 'normal'}
            overflow={'scroll'}
        >
            <Stack
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                space={'32px'}
                width={'100vw'}
                maxWidth={'550px'}
                height={'fit-content'}
                overflowY={'scroll'}
                overflowX={'hidden'}
                padding={'32px'}
                borderRadius={isTablet ? '8px' : 0}
                backgroundColor={achievementState === AchievementState.COMPLETED ? Theme.colors.primary[900] : Theme.colors.white}
            >
                <Box position={'absolute'} width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} padding={'32px'} top={0} left={0}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                        }}
                    >
                        {achievementState === AchievementState.COMPLETED ? <CloseWhite /> : <Close />}
                    </button>
                </Box>
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
                        <Button variant={'solid'}>{buttonText}</Button>
                    </Stack>
                ) : (
                    <Stack width={'100%'} display={'flex'} flexDirection={'column'} space={'8px'}>
                        <Button variant={'outlinelight'}>
                            <Text color={Theme.colors.primary[500]}>{t('achievement.modal.achievements')}</Text>
                        </Button>
                        <Button onClick={onClose} variant={'solid'}>
                            {t('achievement.modal.close')}
                        </Button>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
};

export default AchievementModalMobile;
