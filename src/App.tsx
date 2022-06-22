import React from 'react'
import logo from './logo.svg'
import { Button, NativeBaseProvider, View, Image, Text } from 'native-base'
import { StyleSheet } from 'react-native'
import Theme from './Theme'

function App() {
  const styles = StyleSheet.create({
    text: {
      color: 'red'
    }
  })

  return (
    <NativeBaseProvider theme={Theme}>
      <View>
        <View>
          <Image
            style={{ width: 200, height: 200 }}
            source={{
              uri: logo
            }}
          />
          <Text style={styles.text}>Edit src/App.tsx and save to reload.</Text>
          <Button onPress={() => alert('test')}>TestButton</Button>
        </View>
      </View>
    </NativeBaseProvider>
  )
}

export default App
