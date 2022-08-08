import { NativeBaseProvider, View } from 'native-base'
import Theme from './Theme'
import Navigator from './Navigator'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import Autoload from './Autoload'
import useApollo from './hooks/useApollo'

function App() {
  const { client } = useApollo()
  return (
    <ApolloProvider
      client={client || new ApolloClient({ cache: new InMemoryCache() })}>
      <NativeBaseProvider theme={Theme}>
        <Autoload />
        <Navigator />
      </NativeBaseProvider>
    </ApolloProvider>
  )
}

export default App
