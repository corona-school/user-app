import { Text, Box, VStack, Circle, useTheme } from 'native-base'
import { TouchableWithoutFeedback } from 'react-native'
import IconTagList, { IIconTagList } from '../../widgets/IconTagList'

export interface ISelectionItem {
  key: string
  label: string
  onPress?: () => any
  selected?: boolean
}
const SelectionItem: React.FC<ISelectionItem> = ({
  onPress,
  label,
  selected
}) => <IconTagList text={label} onPress={onPress} variant="center" />

export default SelectionItem
