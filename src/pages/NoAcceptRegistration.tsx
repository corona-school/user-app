import { useTheme, Text, View } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/icons/lernfair/lf-warning.svg';
import { useEffect } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import InfoScreen from '../widgets/InfoScreen';

type Props = {};

const NoAcceptRegistration: React.FC<Props> = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Registrierung fehlgeschlagen!',
        });
    }, []);

    return (
        <View>
            <InfoScreen
                variant="dark"
                title={t('registration.barrier_failed.title')}
                isOutlineButtonLink={true}
                content={
                    <>
                        <Text color="lightText" paddingY={space['0.5']} display="block">
                            {t('registration.barrier_failed.subtitle')}
                        </Text>
                        <Text bold color="lightText" paddingBottom={space['0.5']} display="block">
                            {t('registration.barrier_failed.subtitle2')}
                        </Text>
                    </>
                }
                outlineButtonText={t('registration.barrier_failed.retry')}
                outlinebuttonLink={() => {
                    navigate('/registration');
                }}
                defaultButtonText={t('registration.barrier_failed.alternatives')}
                defaultbuttonLink={() => {
                    window.open('https://digitale-lernangebote.de/', '_blank');
                }}
                icon={<Logo />}
            />
        </View>
    );
};
export default NoAcceptRegistration;
