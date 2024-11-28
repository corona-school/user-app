import { useTheme, Text, View } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/icons/lernfair/lf-logo.svg';
import InfoScreen from '../../../widgets/InfoScreen';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

type Props = {};

const OnBoardingStudentWelcome: React.FC<Props> = () => {
    const { space } = useTheme();
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
        <View>
            <InfoScreen
                variant="dark"
                title={t('onboardingList.Wizard.ethics.welcome.title')}
                content={
                    <Text color="lightText" paddingBottom={space['1.5']}>
                        {t('onboardingList.Wizard.ethics.welcome.content')}
                    </Text>
                }
                defaultButtonText={t('onboardingList.Wizard.ethics.welcome.startTour')}
                defaultbuttonLink={startOnboarding}
                icon={<Logo />}
            />
        </View>
    );
};
export default OnBoardingStudentWelcome;
