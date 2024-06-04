import { useLocation, useNavigate } from 'react-router-dom';
import InfoScreen from '../widgets/InfoScreen';
import Logo from '../assets/icons/lernfair/lf-party.svg';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AlertMessage from '../widgets/AlertMessage';
import { Button, Text, Link, Flex } from 'native-base';

const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();

    const location = useLocation();
    const locState = location.state as { deactivated?: boolean; from?: { pathname: string } };
    const deactivated = locState?.deactivated;
    const retainPath = locState?.from?.pathname ?? '/start';

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
            outlineButtonText={t('signin')}
            outlinebuttonLink={() => navigate('/login', { replace: true, state: { retainPath: retainPath } })}
            defaultButtonText={t('signup')}
            defaultbuttonLink={() => navigate('/registration', { replace: true, state: { retainPath: retainPath } })}
            icon={<Logo />}
            extraContent={<>{deactivated && <AlertMessage content={t('welcome.deactivationAlert')} />}</>}
            footer={
                <>
                    <Flex h="100%" flex="1" flexGrow={1}>
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
                        <Text textAlign="center" paddingTop="20px" display="flex" color="white">
                            <Link onPress={() => window.open('/datenschutz', '_blank')}>{t('settings.legal.datapolicy')}</Link>
                            <Text>{'  '}</Text>
                            <Link onPress={() => window.open('/impressum', '_blank')}>{t('settings.legal.imprint')}</Link>
                        </Text>
                    </Flex>
                </>
            }
        />
    );
};
export default Welcome;
