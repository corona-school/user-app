import { NativeBaseProvider } from 'native-base';
import Theme from './Theme';
import Navigator from './Navigator';
import { datadogRum } from '@datadog/browser-rum';

import { LFApolloProvider } from './hooks/useApollo';
import matomo from './matomo';
import { MatomoProvider } from '@jonkoops/matomo-tracker-react';

import './web/scss/index.scss';
import { LFModalProvider } from './hooks/useModal';
import { LernfairProvider } from './hooks/useLernfair';
import { IssueReporter } from './IssueReporter';
import { NotificationsProvider } from './components/NotificationsProvider';
import { ToastNotifications } from './components/ToastNotifications';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { CreateAppointmentProvider } from './context/AppointmentContext';
import { log } from './log';
import { useEffect } from 'react';

function LogRouting() {
    const location = useLocation();

    useEffect(() => {
        log('Routing', location.pathname);
    }, [location]);

    return null;
}

datadogRum.init({
    applicationId: 'be3c1e11-36bb-4648-9529-2e6824e559a8',
    clientToken: 'pub3381d1dae35d209652b233c1d576d111',
    site: 'datadoghq.eu',
    service: 'daniel-test',
    env: 'dev',
    // Specify a version number to identify the deployed version of your application in Datadog
    version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    traceSampleRate: 100,
    defaultPrivacyLevel: 'mask',
    allowedTracingUrls: ['localhost:3000', 'localhost:4000', 'lernfair.de', (url) => url.startsWith('https://backend-feat-enable-dd--nbzptz.herokuapp.com')],
});

datadogRum.startSessionReplayRecording();

function App() {
    return (
        <LernfairProvider>
            <CreateAppointmentProvider>
                <LFModalProvider>
                    <LFApolloProvider>
                        <BrowserRouter>
                            <LogRouting />
                            <NativeBaseProvider theme={Theme}>
                                <IssueReporter>
                                    <MatomoProvider value={matomo}>
                                        <NotificationsProvider>
                                            <Navigator />
                                            <ToastNotifications />
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
