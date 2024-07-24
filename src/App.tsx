import { NativeBaseProvider } from 'native-base';
import Theme from './Theme';
import Navigator from './routing/Navigator';

import { LFApolloProvider } from './hooks/useApollo';
import matomo from './matomo';
import { MatomoProvider } from '@jonkoops/matomo-tracker-react';

import './web/scss/index.scss';
import { LFModalProvider } from './hooks/useModal';
import { LernfairProvider } from './hooks/useLernfair';
import { IssueReporter } from './IssueReporter';
import { NotificationsProvider } from './context/NotificationsProvider';
import { ToastNotifications } from './components/ToastNotifications';
import { BrowserRouter } from 'react-router-dom';
import { CreateAppointmentProvider } from './context/AppointmentContext';
import { LFChatProvider } from './context/ChatContext';
import NavigationStackProvider from './context/NavigationStackProvider';

import './service-worker-proxy';
import InstallationProvider from './context/InstallationProvider';
import WebPushProvider from './context/WebPushProvider';
import { Toaster } from '@components/atoms/Toaster';

function App() {
    return (
        <LernfairProvider>
            <CreateAppointmentProvider>
                <LFModalProvider>
                    <LFApolloProvider>
                        <WebPushProvider>
                            <BrowserRouter>
                                <NativeBaseProvider theme={Theme}>
                                    <IssueReporter>
                                        <MatomoProvider value={matomo}>
                                            <NotificationsProvider>
                                                <LFChatProvider>
                                                    <NavigationStackProvider>
                                                        <InstallationProvider>
                                                            <Navigator />
                                                        </InstallationProvider>
                                                        <ToastNotifications />
                                                        <Toaster />
                                                    </NavigationStackProvider>
                                                </LFChatProvider>
                                            </NotificationsProvider>
                                        </MatomoProvider>
                                    </IssueReporter>
                                </NativeBaseProvider>
                            </BrowserRouter>
                        </WebPushProvider>
                    </LFApolloProvider>
                </LFModalProvider>
            </CreateAppointmentProvider>
        </LernfairProvider>
    );
}

export default App;
