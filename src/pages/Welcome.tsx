import { useLocation, useNavigate } from 'react-router-dom';
import InfoScreen from '../widgets/InfoScreen';
import Logo from '../assets/icons/lernfair/lf-party.svg';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AlertMessage from '../widgets/AlertMessage';
import { Button, Text } from 'native-base';

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();

    const location = useLocation();
    const locState = location.state as { deactivated?: boolean };
    const deactivated = locState?.deactivated;

    useEffect(() => {
        trackPageView({
            documentTitle: 'Welcome Page',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <InfoScreen
            variant="dark"
            title={t('welcome.title')}
            content={t('welcome.subtitle')}
            outlineButtonText={t('welcome.btn.login')}
            outlinebuttonLink={() => navigate('/login')}
            defaultButtonText={t('welcome.btn.signup')}
            defaultbuttonLink={() => navigate('/registration')}
            icon={<Logo />}
            extraContent={deactivated && <AlertMessage content={t('welcome.deactivationAlert')} />}
            footer={
                <>
                    <Text textAlign="center" paddingTop="70px" color="white">
                        {t('welcome.needHelp')}
                    </Text>
                    <Button
                        onPress={() =>
                            (window.location.href = 'mailto:support@lern-fair.de?subject=Probleme%20bei%20der%20Anmeldung%20im%20neuen%20Userbereich')
                        }
                        variant="link"
                        textAlign="center"
                    >
                        {t('welcome.contactSupport')}
                    </Button>
                </>
            }
        />
    );
};
export default Welcome;
