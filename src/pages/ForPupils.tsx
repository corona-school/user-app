import AsNavigationItem from '../components/AsNavigationItem';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@/components/Typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';

const ForPupils = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const currentTabFromRoute = pathname.split('/').pop();
    return (
        <AsNavigationItem path="knowledge-pupil">
            <WithNavigation
                previousFallbackRoute="/start"
                headerTitle={t('forPupils.title')}
                headerLeft={
                    <div className="flex items-center flex-row">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                <div className="h-full flex flex-col">
                    <div className="w-full max-w-5xl pt-4 pb-3 px-1.5">
                        <Typography variant="h4" className="mb-1.5">
                            {t('forPupils.title')}
                        </Typography>
                        <Typography>{t('forPupils.description')}</Typography>
                    </div>
                    <div className="w-full mx-auto flex-1">
                        <Tabs className="h-full" value={currentTabFromRoute || 'learn-methods'} onValueChange={(tabId) => navigate(tabId)}>
                            <TabsList className="hidden">
                                <TabsTrigger value="learn-methods">{t('forPupils.tabs.learnMethods')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="learn-methods" className="h-full">
                                <Outlet />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default ForPupils;
