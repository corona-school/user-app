import AsNavigationItem from '../components/AsNavigationItem';
import SwitchLanguageButton from '../components/SwitchLanguageButton';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';
import { Typography } from '@/components/Typography';

const tabs = ['handbook', 'mentoring', 'online-training'];

const KnowledgeCenter = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const path = pathname.split('/').pop() || '';
    const currentTabFromRoute = tabs.includes(path) ? path : tabs[0];
    return (
        <AsNavigationItem path="knowledge-helper">
            <WithNavigation
                previousFallbackRoute="/settings"
                headerTitle={t('forStudents.title')}
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
                            {t('forStudents.title')}
                        </Typography>
                        <Typography>{t('forStudents.description')}</Typography>
                    </div>
                    <div className="w-full mx-auto flex-1">
                        <Tabs className="h-full" value={currentTabFromRoute} onValueChange={(tabId) => navigate(tabId)}>
                            <TabsList>
                                <TabsTrigger value="handbook">{t('forStudents.tabs.handbook')}</TabsTrigger>
                                <TabsTrigger value="mentoring">{t('forStudents.tabs.mentoring')}</TabsTrigger>
                                <TabsTrigger value="online-training">{t('forStudents.tabs.onlineTraining')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="handbook" className="h-full">
                                <Outlet />
                            </TabsContent>
                            <TabsContent value="mentoring" className="h-full">
                                <Outlet />
                            </TabsContent>
                            <TabsContent value="online-training" className="h-full">
                                <div className="px-4 h-full">
                                    <Outlet />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default KnowledgeCenter;
