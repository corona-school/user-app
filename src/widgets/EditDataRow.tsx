import { View, Text, ChevronRightIcon, useTheme, Pressable } from 'native-base'
import DataRow from '../components/DataRow'

type Props = {
  label: string
  value?: string
  onPress?: () => any
  isDisabled?: boolean
}

const EditDataRow: React.FC<Props> = ({
  label,
  value,
  onPress,
  isDisabled
}) => {
  const { space } = useTheme()
  const textColor = isDisabled ? 'gray.300' : 'darkText'
  return (
    <Pressable onPress={onPress} isDisabled={isDisabled}>
      <DataRow>
        <Text flex="1" fontWeight={600} color={textColor}>
          {label}
        </Text>
        {value && (
          <Text marginRight={space['0.5']} color={textColor}>
            {value}
          </Text>
        )}
        <ChevronRightIcon color={textColor} />
      </DataRow>
    </Pressable>
  )
}
export default EditDataRow
