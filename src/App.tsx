import { NativeBaseProvider } from 'native-base'
import Theme from './Theme'
import Navigator from './Navigator'

import { LFApolloProvider } from './hooks/useApollo'
import matomo from './matomo'
import { MatomoProvider } from '@jonkoops/matomo-tracker-react'

import './web/scss/index.scss'
import FullPageModal from './widgets/FullPageModal'
import { LFModalProvider } from './hooks/useModal'

function App() {
  return (
    <LFModalProvider>
      <LFApolloProvider>
        <NativeBaseProvider theme={Theme}>
          <MatomoProvider value={matomo}>
            <Navigator />
            <FullPageModal />
          </MatomoProvider>
        </NativeBaseProvider>
      </LFApolloProvider>
    </LFModalProvider>
  )
}

export default App
