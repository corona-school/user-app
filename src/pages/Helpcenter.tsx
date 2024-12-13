import WithNavigation from '../components/WithNavigation';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import IFrame from '../components/IFrame';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import AsNavigationItem from '../components/AsNavigationItem';
import { useUserType } from '../hooks/useApollo';
import NotificationAlert from '../components/notifications/NotificationAlert';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import { SwitchUserType } from '../User';
import ContactSupportForm from '../components/ContactSupportForm';
import { Typography } from '@/components/Typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';
import { Breadcrumb } from '@/components/Breadcrumb';

const HelpCenter: React.FC = () => {
    const userType = useUserType();

    const { t } = useTranslation();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Hilfebereich',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isStudent = userType === 'student';
    const isPupil = userType === 'pupil';

    const defaultValue = useMemo(() => {
        if (isPupil) return 'faq-sus';
        if (isStudent) return 'faq-huh';
        return 'contact';
    }, [isStudent, isPupil]);

    return (
        <AsNavigationItem path="hilfebereich">
            <WithNavigation
                previousFallbackRoute="/settings"
                headerTitle="Hilfebereich"
                headerLeft={
                    <div className="flex items-center flex-row">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                <div className="h-full flex flex-col">
                    <div className="w-full max-w-5xl pb-3 px-1.5">
                        <Breadcrumb />
                        <Typography variant="h4" className="mb-1.5">
                            {t('helpcenter.title')}
                        </Typography>
                        <SwitchUserType
                            pupilComponent={<Typography>{t('helpcenter.subtitle.pupil')}</Typography>}
                            studentComponent={<Typography>{t('helpcenter.subtitle.student')}</Typography>}
                        />
                    </div>
                    <Tabs className="h-full" defaultValue={defaultValue}>
                        <TabsList>
                            {isPupil && <TabsTrigger value="faq-sus">{t('helpcenter.faq.tabName')}</TabsTrigger>}
                            {isStudent && <TabsTrigger value="faq-huh">{t('helpcenter.faq.tabName')}</TabsTrigger>}
                            <TabsTrigger value="contact">{t('helpcenter.contact.tabName')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="faq-sus" className="h-full">
                            <IFrame src="https://www.lern-fair.de/iframe/faq-sus" title="faq" width="100%" />
                        </TabsContent>
                        <TabsContent value="faq-huh" className="h-full">
                            <IFrame src="https://www.lern-fair.de/iframe/faq-huh" title="faq" width="100%" />
                        </TabsContent>
                        <TabsContent value="contact" className="h-full pt-4">
                            <ContactSupportForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default HelpCenter;
