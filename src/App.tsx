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

function App() {
    return (
        <LernfairProvider>
            <LFModalProvider>
                <LFApolloProvider>
                    <NativeBaseProvider theme={Theme}>
                        <IssueReporter>
                            <MatomoProvider value={matomo}>
                                <Navigator />
                            </MatomoProvider>
                        </IssueReporter>
                    </NativeBaseProvider>
                </LFApolloProvider>
            </LFModalProvider>
        </LernfairProvider>
    );
}

export default App;
