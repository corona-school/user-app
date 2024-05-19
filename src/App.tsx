import { NativeBaseProvider } from 'native-base';
import Theme, { theme } from './Theme';
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
import { ChakraProvider } from '@chakra-ui/react';

function App() {
    return (
        <LernfairProvider>
            <CreateAppointmentProvider>
                <LFModalProvider>
                    <LFApolloProvider>
                        <BrowserRouter>
                            <ChakraProvider theme={theme}>
                                <NativeBaseProvider theme={Theme}>
                                    <IssueReporter>
                                        <MatomoProvider value={matomo}>
                                            <NotificationsProvider>
                                                <LFChatProvider>
                                                    <NavigationStackProvider>
                                                        <Navigator />
                                                        <ToastNotifications />
                                                    </NavigationStackProvider>
                                                </LFChatProvider>
                                            </NotificationsProvider>
                                        </MatomoProvider>
                                    </IssueReporter>
                                </NativeBaseProvider>
                            </ChakraProvider>
                        </BrowserRouter>
                    </LFApolloProvider>
                </LFModalProvider>
            </CreateAppointmentProvider>
        </LernfairProvider>
    );
}

export default App;
