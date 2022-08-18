import { View, Text, ChevronRightIcon, useTheme, Pressable } from 'native-base'
import DataRow from '../components/DataRow'

type Props = {
  label: string
  value?: string
  onPress?: () => any
}

const EditDataRow: React.FC<Props> = ({ label, value, onPress }) => {
  const { space } = useTheme()

  return (
    <Pressable onPress={onPress}>
      <DataRow>
        <Text flex="1" fontWeight={600}>
          {label}
        </Text>
        {value && <Text marginRight={space['0.5']}>{value}</Text>}
        <ChevronRightIcon color="primary.700" />
      </DataRow>
    </Pressable>
  )
}
export default EditDataRow
