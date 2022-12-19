import { NativeBaseProvider } from 'native-base';
import Theme from './Theme';
import Navigator from './Navigator';

import { LFApolloProvider } from './hooks/useApollo';
import matomo from './matomo';
import { MatomoProvider } from '@jonkoops/matomo-tracker-react';

import './web/scss/index.scss';
import FullPageModal from './widgets/FullPageModal';
import { LFModalProvider } from './hooks/useModal';
import { LernfairProvider } from './hooks/useLernfair';
import { IssueReporter } from './IssueReporter';
import { NotificationsProvider } from './components/NotificationsProvider';
import { ToastNotifications } from './components/ToastNotifications';

function App() {
    return (
        <LernfairProvider>
            <LFModalProvider>
                <LFApolloProvider>
                    <NativeBaseProvider theme={Theme}>
                        <IssueReporter>
                            <MatomoProvider value={matomo}>
                                <Navigator />
                                <FullPageModal />
                                <NotificationsProvider>
                                    <ToastNotifications />
                                </NotificationsProvider>
                            </MatomoProvider>
                        </IssueReporter>
                    </NativeBaseProvider>
                </LFApolloProvider>
            </LFModalProvider>
        </LernfairProvider>
    );
}

export default App;
