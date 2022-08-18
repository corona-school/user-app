import { NativeBaseProvider, View } from 'native-base'
import Theme from './Theme'
import Navigator from './Navigator'
import { ApolloProvider } from '@apollo/client'
import Autoload from './Autoload'
import useApollo from './hooks/useApollo'

import './web/scss/index.scss'

function App() {
  const { client } = useApollo()
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider theme={Theme}>
        <Autoload />
        <Navigator />
      </NativeBaseProvider>
    </ApolloProvider>
  )
}

export default App
