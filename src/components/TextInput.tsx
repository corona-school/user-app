import { VStack, Input, View, Text, useTheme } from 'native-base'
import { InterfaceInputProps } from 'native-base/lib/typescript/components/primitives/Input/types'

interface Props extends InterfaceInputProps {}

const TextInput: React.FC<Props> = props => {
  const { space } = useTheme()

  return (
    <VStack
      style={{ position: 'relative' }}
      width={props.width}
      flex={props.flex}>
      {props.placeholder && (
        <View position={'relative'} zIndex={10}>
          <Text
            style={{
              opacity: 1,
              zIndex: 10,
              position: 'absolute',
              left: space['3'],
              top: 5
            }}>
            {props.placeholder}
          </Text>
        </View>
      )}
      <Input
        {...props}
        style={{ paddingTop: space['6'], paddingBottom: space['3'] }}
        placeholder={undefined}
      />
    </VStack>
  )
}
export default TextInput
