import { NativeBaseProvider } from 'native-base'
import Theme from './Theme'
import Navigator from './Navigator'
import { ApolloProvider } from '@apollo/client'
import Autoload from './Autoload'
import useApollo from './hooks/useApollo'
import matomo from './matomo'
import { MatomoProvider } from '@jonkoops/matomo-tracker-react'

import './web/scss/index.scss'
import FullPageModal, { ModalContext } from './widgets/FullPageModal'
import useModal from './hooks/useModal'

function App() {
  const { client } = useApollo()
  const {
    show,
    content,
    setShow: _setShow,
    setContent: _setContent
  } = useModal()

  return (
    <ModalContext.Provider
      value={{
        show,
        content,
        setShow: val => _setShow(val),
        setContent: val => _setContent(val)
      }}>
      <ApolloProvider client={client}>
        <NativeBaseProvider theme={Theme}>
          <MatomoProvider value={matomo}>
            <Autoload />
            <Navigator />
            <FullPageModal />
          </MatomoProvider>
        </NativeBaseProvider>
      </ApolloProvider>
    </ModalContext.Provider>
  )
}

export default App
