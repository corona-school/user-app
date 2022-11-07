import IconTagList from '../../widgets/IconTagList'

export interface ISelectionItem {
  key: string
  label: string
  onPress?: () => any
  selected?: boolean
  text?: string
}
const SelectionItem: React.FC<ISelectionItem> = ({
  onPress,
  label,
  selected
}) => <IconTagList text={label} onPress={onPress} variant="center" />

export default SelectionItem
