import { NativeBaseProvider } from 'native-base'
import Theme from './Theme'
import Navigator from './Navigator'

import { LFApolloProvider } from './hooks/useApollo'
import matomo from './matomo'
import { MatomoProvider } from '@jonkoops/matomo-tracker-react'

import './web/scss/index.scss'
import FullPageModal from './widgets/FullPageModal'
import { LFModalProvider } from './hooks/useModal'
import { LernfairProvider } from './hooks/useLernfair'
import { NotificationsProvider } from './hooks/NotificationsProvider'
import { WebsocketClient } from "./components/WebsocketClient"

function App () {
  return (
    <>
      <NotificationsProvider><WebsocketClient /></NotificationsProvider>
      
      <LernfairProvider>
        <LFModalProvider>
          <LFApolloProvider>
            <NativeBaseProvider theme={Theme}>
              <MatomoProvider value={matomo}>
                <Navigator/>
                <FullPageModal/>
              </MatomoProvider>
            </NativeBaseProvider>
          </LFApolloProvider>
        </LFModalProvider>
      </LernfairProvider>
    </>
  )
}

export default App
