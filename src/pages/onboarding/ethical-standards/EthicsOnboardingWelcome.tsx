import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { IconArrowRight } from '@tabler/icons-react';
import WithNavigation from '@/components/WithNavigation';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

const EthicsOnboardingWelcome: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { trackEvent } = useMatomo();

    const startOnboarding = () => {
        trackEvent({
            category: 'HuH Registration',
            action: 'Button Click',
            name: 'Ethikonboarding gestartet',
        });
        navigate('/onboarding/ethics/wizard');
    };

    return (
        <WithNavigation hideMenu classes={{ contentContainerClassName: 'bg-accent' }}>
            <div className="flex flex-col items-start justify-center h-full max-w-3xl mx-auto px-8 gap-6">
                <Typography variant="h1">{t('onboardingList.Wizard.ethics.welcome.title')}</Typography>
                <Typography>{t('onboardingList.Wizard.ethics.welcome.content1')}</Typography>
                <Typography>{t('onboardingList.Wizard.ethics.welcome.content2')}</Typography>
                <Button rightIcon={<IconArrowRight size={16} />} onClick={startOnboarding}>
                    {t('onboardingList.Wizard.ethics.welcome.startTour')}
                </Button>
            </div>
        </WithNavigation>
    );
};

export default EthicsOnboardingWelcome;
