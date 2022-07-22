import { NativeBaseProvider, View } from 'native-base'
import Theme from './Theme'
import Navigator from './Navigator'

function App() {
  return (
    <NativeBaseProvider theme={Theme}>
      <Navigator></Navigator>
    </NativeBaseProvider>
  )
}

export default App
