import NotificationAlert from '@/components/notifications/NotificationAlert';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import useApollo from '@/hooks/useApollo';
import Android from '@/assets/images/logos/Android.png';
import IOS from '@/assets/images/logos/iOS.png';
import Image1 from '@/assets/screenshots/mobile-1.png';
import Image2 from '@/assets/screenshots/mobile-2.png';
import Image3 from '@/assets/screenshots/mobile-3.png';
import Image4 from '@/assets/screenshots/mobile-4.png';
import Image5 from '@/assets/screenshots/mobile-5.png';
import { Button } from '@/components/Button';
import { IconDownload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { InstallationContext } from '@/context/InstallationProvider';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

const InstallApp = () => {
    const { t } = useTranslation();
    const { sessionState } = useApollo();
    const { trackPageView, trackEvent } = useMatomo();
    const { canInstall, isInstalled, install } = useContext(InstallationContext);
    const isLoggedIn = sessionState === 'logged-in';
    const props = t('installation.page.pros.list', { returnObjects: true });
    const installationDetails = t('installation.page.installationDetails.list', { returnObjects: true });

    useEffect(() => {
        trackPageView({
            documentTitle: 'App installieren',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnInstall = async () => {
        trackEvent({
            category: 'pwa',
            action: 'install-button-is-clicked',
            name: 'install-page',
        });
        await install();
    };

    return (
        <WithNavigation
            hideMenu
            previousFallbackRoute="/start"
            showBack
            headerLeft={
                <div className="flex items-center">
                    <SwitchLanguageButton />
                    {isLoggedIn && <NotificationAlert />}
                </div>
            }
        >
            <div className="flex flex-col max-w-5xl mx-auto gap-y-7">
                <div>
                    <Typography variant="h2" className="mb-4">
                        {t('installation.page.title')}
                    </Typography>
                    <Typography className="w-full md:w-[60%] text-pretty">{t('installation.page.description')}</Typography>
                </div>
                <div className="flex gap-x-8 pt-4">
                    <div>
                        <img src={Android} alt="Android Logo" className="w-16" />
                    </div>
                    <div>
                        <img src={IOS} alt="iOS Logo" className="w-16" />
                    </div>
                </div>
                {canInstall && !isInstalled && (
                    <Button onClick={handleOnInstall} className="w-full md:min-[200px] md:w-fit mt-4" variant="secondary" leftIcon={<IconDownload />}>
                        {t('installation.page.install')}
                    </Button>
                )}
                {isInstalled && <Typography className="text-green-600">{t('installation.page.installed')}</Typography>}
                <div className="flex overflow-x-scroll">
                    <img src={Image1} alt="App preview" className="w-[200px]" />
                    <img src={Image2} alt="App preview" className="w-[200px]" />
                    <img src={Image3} alt="App preview" className="w-[200px]" />
                    <img src={Image4} alt="App preview" className="w-[200px]" />
                    <img src={Image5} alt="App preview" className="w-[200px]" />
                </div>
                <div className="w-full md:w-[60%]">
                    <div>
                        <Typography variant="h4">{t('installation.page.pros.title')}</Typography>
                        <ul className="list-disc list-inside mt-4 text-pretty">
                            {props.map((e) => (
                                <li>{e}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-6">
                        <Typography variant="h4">{t('installation.page.installationDetails.title')}</Typography>
                        <ul className="list-disc list-inside mt-4 text-pretty">
                            {installationDetails.map((e) => (
                                <li>{e}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </WithNavigation>
    );
};

export default InstallApp;
