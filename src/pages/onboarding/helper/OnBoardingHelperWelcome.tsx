import { useTheme, Text, View, Modal } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/icons/lernfair/lf-logo.svg';
import { useEffect, useState } from 'react';
import InfoScreen from '../../../widgets/InfoScreen';
import OnBoardingSkipModal from '../../../widgets/OnBoardingSkipModal';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

type Props = {};

const OnBoardingHelperWelcome: React.FC<Props> = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [cancelModal, setCancelModal] = useState<boolean>(false);
    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Onboarding Welcome',
        });
    }, []);

    return (
        <View>
            <InfoScreen
                variant="dark"
                title={t('onboardingList.Wizard.helper.welcome.title')}
                isOutlineButtonLink={true}
                content={
                    <>
                        <Text color="lightText" paddingBottom={space['1.5']}>
                            {t('onboardingList.Wizard.helper.welcome.content')}
                        </Text>
                        <Text maxWidth="240px" marginX="auto" bold color="lightText" paddingBottom={space['0.5']}>
                            {t('onboardingList.Wizard.helper.welcome.question')}
                        </Text>
                        <Text color="lightText">{t('onboardingList.Wizard.helper.welcome.answer')}</Text>
                    </>
                }
                outlineButtonText={t('onboardingList.Wizard.helper.welcome.skipTour')}
                outlinebuttonLink={() => {
                    trackEvent({
                        category: 'onboarding',
                        action: 'click-event',
                        name: 'Onboarding Helfer – überspringen',
                        documentTitle: 'Onboarding Helfer – Welcomepage',
                    });
                    setCancelModal(true);
                }}
                defaultButtonText={t('onboardingList.Wizard.helper.welcome.startTour')}
                defaultbuttonLink={() => navigate('/onboarding/helper/wizard/')}
                icon={<Logo />}
            />
            <Modal bg="modalbg" isOpen={cancelModal} onClose={() => setCancelModal(false)}>
                <OnBoardingSkipModal
                    onPressClose={() => setCancelModal(false)}
                    onPressDefaultButton={() => setCancelModal(false)}
                    onPressOutlineButton={() => navigate('/onboarding-list')}
                />
            </Modal>
        </View>
    );
};
export default OnBoardingHelperWelcome;
