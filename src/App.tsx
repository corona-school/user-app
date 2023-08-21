import { NativeBaseProvider } from 'native-base';
import Theme from './Theme';
import Navigator from './Navigator';

import { LFApolloProvider } from './hooks/useApollo';
import matomo from './matomo';
import { MatomoProvider } from '@jonkoops/matomo-tracker-react';

import './web/scss/index.scss';
import { LFModalProvider } from './hooks/useModal';
import { LernfairProvider } from './hooks/useLernfair';
import { IssueReporter } from './IssueReporter';
import { NotificationsProvider } from './components/NotificationsProvider';
import { ToastNotifications } from './components/ToastNotifications';
import { BrowserRouter } from 'react-router-dom';
import { CreateAppointmentProvider } from './context/AppointmentContext';
import { LFChatProvider } from './context/ChatContext';

function App() {
    return (
        <LernfairProvider>
            <CreateAppointmentProvider>
                <LFModalProvider>
                    <LFApolloProvider>
                        <BrowserRouter>
                            <NativeBaseProvider theme={Theme}>
                                <IssueReporter>
                                    <MatomoProvider value={matomo}>
                                        <NotificationsProvider>
                                            <LFChatProvider>
                                                <Navigator />
                                                <ToastNotifications />
                                            </LFChatProvider>
                                        </NotificationsProvider>
                                    </MatomoProvider>
                                </IssueReporter>
                            </NativeBaseProvider>
                        </BrowserRouter>
                    </LFApolloProvider>
                </LFModalProvider>
            </CreateAppointmentProvider>
        </LernfairProvider>
    );
}

export default App;
