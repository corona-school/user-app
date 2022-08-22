import { NativeBaseProvider } from 'native-base'
import Theme from './Theme'
import Navigator from './Navigator'
import { ApolloProvider } from '@apollo/client'
import Autoload from './Autoload'
import useApollo from './hooks/useApollo'
import matomo from './matomo'
import { MatomoProvider } from '@jonkoops/matomo-tracker-react'

import './web/scss/index.scss'

function App() {
  const { client } = useApollo()
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider theme={Theme}>
        <MatomoProvider value={matomo}>
          <Autoload />
          <Navigator />
        </MatomoProvider>
      </NativeBaseProvider>
    </ApolloProvider>
  )
}

export default App
