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

  return (
    <Pressable onPress={onPress} isDisabled={isDisabled}>
      <DataRow>
        <Text
          flex="1"
          fontWeight={600}
          color={isDisabled ? 'gray.500' : 'darkText'}>
          {label}
        </Text>
        {value && (
          <Text
            marginRight={space['0.5']}
            color={isDisabled ? 'gray.500' : 'darkText'}>
            {value}
          </Text>
        )}
        <ChevronRightIcon color={isDisabled ? 'gray.500' : 'primary.700'} />
      </DataRow>
    </Pressable>
  )
}
export default EditDataRow
