import { useTranslation } from 'react-i18next';
import AchievementImageContainer from '../AchievementImageContainer';
import CheckGreen from '../../../assets/icons/icon_check_green.svg';
import AchievementBadge from '../AchievementBadge';
import IndicatorBar from '../progressIndicators/IndicatorBar';
import IndicatorBarWithSteps from '../progressIndicators/IndicatorBarWithSteps';
import NewAchievementShine from '../cosmetics/NewAchievementShine';
import { Achievement_State, Achievement_Type_Enum, Step } from '../../../gql/graphql';
import { useLocation, useNavigate } from 'react-router-dom';
import { Linking } from 'react-native';
import { Modal, ModalTitle } from '@/components/Modal';
import { cn } from '@/lib/Tailwind';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';

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

    const activeStep = steps.findIndex((step) => step.isActive);
    const textColor = achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak ? 'text-white' : 'text-primary';

    return (
        <Modal
            isOpen={!!showModal}
            onOpenChange={() => onClose && onClose()}
            className={cn(
                'w-full lg:w-[820px] max-w-[550px] lg:max-w-[820px] h-dvh lg:h-fit rounded-none lg:rounded-md',
                achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak ? 'bg-primary' : 'bg-white',
                achievementType === Achievement_Type_Enum.Tiered && achievementState === Achievement_State.Completed ? 'mt-0 lg:mt-[62px]' : undefined
            )}
            classes={{
                closeIcon:
                    achievementState === Achievement_State.Completed || achievementType === Achievement_Type_Enum.Streak
                        ? 'text-primary-foreground'
                        : 'text-primary',
            }}
        >
            <div className="flex flex-col w-full max-w-[550px] lg:max-w-[820px] h-full lg:h-fit justify-between md:justify-center lg:justify-between">
                <div className="flex flex-col w-full max-w-[550px] lg:max-w-[820px] h-fit">
                    <div className="flex flex-col lg:flex-row w-full max-w-[550px] lg:max-w-[820px] h-fit gap-4 lg:gap-8 items-center lg:items-start justify-between md:justify-center lg:justify-between p-4 lg:p-8">
                        <div className={cn('items-center h-fit lg:h-full', achievementState === Achievement_State.Completed && 'top-5 lg:top-0')}>
                            <AchievementImageContainer
                                image={achievementType === Achievement_Type_Enum.Tiered && achievementState !== Achievement_State.Completed ? undefined : image}
                                alternativeText={alternativeText || ''}
                                achievementType={achievementType}
                                achievementState={achievementState}
                                record={steps.length > 0 ? steps.length : maxSteps}
                                isRecord={maxSteps === currentStep}
                                isLarge
                            />
                            {isNewAchievement && (
                                <div className={cn('flex flex-col absolute top-[20%] w-fit justify-end h-[136px] md:h-[210px]')}>
                                    <div className="w-[136px] md:w-[210px] h-[calc(136px * 1.4)] md:h-[calc(210px * 1.4)]">
                                        <NewAchievementShine />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col w-full lg:w-[473px] gap-3 max-w-full lg:max-w-[473px] items-center lg:items-start">
                            <Typography className={cn('text-center lg:hidden', textColor)}>{tagline}</Typography>
                            <div className="items-center gap-[12px] h-5 hidden lg:flex">
                                {isNewAchievement && <AchievementBadge isInline />}
                                <Typography className={cn(textColor)}>{tagline}</Typography>
                            </div>
                            <ModalTitle className={cn('font-bold text-xl lg:text-[36px] leading-5 lg:leading-8 text-center lg:text-left', textColor)}>
                                {title}
                            </ModalTitle>
                            <Typography className={cn(textColor, 'hidden lg:block')}>{description}</Typography>
                        </div>
                        <div className="flex flex-col w-full items-center gap-8 lg:hidden">
                            <div className="w-full">
                                {achievementState === Achievement_State.Completed ? (
                                    <div className="flex w-full justify-center items-center">
                                        {isNewAchievement ? (
                                            <AchievementBadge isInline />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {achievementState === Achievement_State.Completed && <CheckGreen />}
                                                <Typography className={cn('text-center', textColor)}>{footer}</Typography>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full">
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
                                    </div>
                                )}
                            </div>
                            <Typography className={cn('w-full text-sm', textColor)}>{description}</Typography>
                        </div>
                    </div>
                </div>
                <div className="h-fit hidden lg:block">
                    {achievementType !== Achievement_Type_Enum.Sequential ? (
                        <div className="h-fit">
                            {achievementState === Achievement_State.Completed ? (
                                <div className="flex items-center gap-2 h-fit">
                                    <CheckGreen />
                                    <Typography className={cn('text-detail', textColor)}>{footer}</Typography>
                                </div>
                            ) : (
                                <div className="w-full h-fit">
                                    <IndicatorBar
                                        // In case of a streak, we have to reach maxValue + 1
                                        // Otherwise, max value is desired, like "3 / 5 Termine"
                                        maxSteps={achievementType === Achievement_Type_Enum.Streak ? (maxSteps || 0) + 1 : maxSteps || 0}
                                        currentStep={currentStep}
                                        progressDescription={footer}
                                        fullWidth
                                        largeText
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-fit">
                            {steps.length > 0 && <IndicatorBarWithSteps maxSteps={steps.length} steps={steps} achievementState={achievementState} />}
                        </div>
                    )}
                </div>
                {buttonLink && buttonText && achievementState !== Achievement_State.Completed ? (
                    <div className="flex flex-col lg:flex-row w-full gap-2 pt-2 lg:pt-5">
                        <Button className="w-full" variant="outline-light" onClick={onClose}>
                            {t('achievement.modal.close')}
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline-light"
                            onClick={() => {
                                pathname === '/progress' && onClose ? onClose() : navigate('/progress');
                            }}
                        >
                            {t('achievement.modal.achievements')}
                        </Button>
                        <Button
                            onClick={() => {
                                if (buttonLink.startsWith('mailto') || buttonLink.startsWith('http')) {
                                    Linking.openURL(buttonLink);
                                } else {
                                    navigate(buttonLink);
                                }
                            }}
                            className="w-full"
                            variant="secondary"
                        >
                            {buttonText}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row w-full gap-2 pt-2 lg:pt-5">
                        <Button
                            className="w-full"
                            variant="outline-light"
                            onClick={() => {
                                pathname === '/progress' && onClose ? onClose() : navigate('/progress');
                            }}
                        >
                            {t('achievement.modal.achievements')}
                        </Button>
                        <Button className="w-full" variant="secondary" onClick={onClose}>
                            {t('achievement.modal.close')}
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AchievementModal;
