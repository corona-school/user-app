import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { IconArrowLeft, IconArrowRight, IconPlayerTrackPrev, IconThumbUp } from '@tabler/icons-react';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import useApollo from '@/hooks/useApollo';
import WithNavigation from '@/components/WithNavigation';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { ProgressBar } from '@/components/ProgressBar';

const TOTAL_STEPS = 5;

const SCREEN_KEYS = ['screen1', 'screen2', 'screen3', 'screen4', 'screen5'] as const;

const EthicsOnboardingSlides: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { refreshUser } = useApollo();
    const { trackEvent } = useMatomo();

    const [currentStep, setCurrentStep] = useState(0);
    const [checkboxChecked, setCheckboxChecked] = useState(false);

    const [setOnboardingDoneTrue] = useMutation(
        gql(`
            mutation updateHasDoneEthicsOnboarding {
                studentUpdate(data: {hasDoneEthicsOnboarding: true})
            }
        `)
    );

    const onFinish = async () => {
        trackEvent({
            category: 'HuH Registration',
            action: 'Button Click',
            name: 'Ethikonboarding abgeschlossen',
        });
        await setOnboardingDoneTrue();
        await refreshUser();
        navigate('/start');
    };

    const goBack = () => {
        if (currentStep === 0) {
            navigate('/onboarding/ethics/welcome');
        } else {
            setCurrentStep((s) => s - 1);
        }
    };

    const goForward = () => {
        if (currentStep < TOTAL_STEPS - 1) {
            setCurrentStep((s) => s + 1);
        }
    };

    const screenKey = SCREEN_KEYS[currentStep];
    const isLastStep = currentStep === TOTAL_STEPS - 1;
    const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

    const stepTitle = isLastStep
        ? t('onboardingList.Wizard.ethics.screen5.fastFertigTitle')
        : `${currentStep + 1}. ${t(`onboardingList.Wizard.ethics.${screenKey}.title` as any)}`;

    return (
        <WithNavigation showBack hideMenu previousFallbackRoute="/onboarding/ethics/welcome" classes={{ contentContainerClassName: 'bg-accent' }}>
            <div className="flex flex-col h-full">
                {/* Progress bar */}
                <div className="px-6 pt-6">
                    <ProgressBar value={progress} />
                </div>

                {/* Step title */}
                <div className="px-6 pt-4 pb-2">
                    <Typography className="hyphens-auto break-words" variant="h2">
                        {stepTitle}
                    </Typography>
                </div>

                {/* Card area */}
                <div className="flex-1 flex items-center justify-center px-6 py-4">
                    {isLastStep ? (
                        /* Confirmation card — no stacked effect */
                        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-md p-8 flex flex-col items-center gap-6">
                            <Checkbox checked={checkboxChecked} className="size-10 rounded" onCheckedChange={(checked) => setCheckboxChecked(!!checked)} />
                            <Typography className="text-center max-w-sm">{t('onboardingList.Wizard.ethics.screen5.checkboxText')}</Typography>
                            <Button disabled={!checkboxChecked} rightIcon={<IconThumbUp size={16} />} onClick={onFinish}>
                                {t('onboardingList.Wizard.ethics.screen5.finishButton')}
                            </Button>
                        </div>
                    ) : (
                        /* Content card with stacked effect */
                        <div className="relative w-full max-w-2xl">
                            <div className="absolute inset-0 rounded-2xl bg-white shadow-sm translate-x-3 translate-y-3" />
                            <div className="absolute inset-0 rounded-2xl bg-white shadow-sm translate-x-1.5 translate-y-1.5" />
                            <div className="relative z-10 rounded-2xl bg-white shadow-md p-8 space-y-4">
                                <Typography variant="h3">{t(`onboardingList.Wizard.ethics.${screenKey}.header1` as any)}</Typography>
                                <Typography>{t(`onboardingList.Wizard.ethics.${screenKey}.content1` as any)}</Typography>
                                <Typography variant="h3">{t(`onboardingList.Wizard.ethics.${screenKey}.header2` as any)}</Typography>
                                <Typography>{t(`onboardingList.Wizard.ethics.${screenKey}.content2` as any)}</Typography>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-center gap-3 pb-8">
                    {isLastStep ? (
                        <>
                            <Button size="icon" onClick={() => navigate('/onboarding/ethics/welcome')}>
                                <IconPlayerTrackPrev size={18} />
                            </Button>
                            <Button size="icon" onClick={goBack}>
                                <IconArrowLeft size={18} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button size="icon" onClick={goBack}>
                                <IconArrowLeft size={18} />
                            </Button>
                            <Button size="icon" onClick={goForward}>
                                <IconArrowRight size={18} />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </WithNavigation>
    );
};

export default EthicsOnboardingSlides;
