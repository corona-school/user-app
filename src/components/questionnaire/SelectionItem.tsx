import { Text, Box, VStack, Circle, useTheme } from 'native-base'
import { TouchableWithoutFeedback } from 'react-native'

export type ISelectionItem = {
  key: string
  label: string
  onPress?: () => any
  selected?: boolean
}
const SelectionItem: React.FC<ISelectionItem> = ({
  onPress,
  label,
  selected
}) => {
  const { space } = useTheme()
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Box
        flex="1"
        bgColor={selected ? 'primary.900' : 'primary.100'}
        paddingY={space['1']}>
        <VStack space={space['1']} alignItems="center">
          <Circle size="8" bgColor="lightText" />
          <Text bold color={selected ? 'lightText' : 'darkText'}>
            {label}
          </Text>
        </VStack>
      </Box>
    </TouchableWithoutFeedback>
  )
}
export default SelectionItem
