import { Text, useTheme, Pressable, Row, Column } from 'native-base'

import { LFInstructor } from '../types/lernfair/Course'

type Props = {
  isAdded?: boolean
  instructor: LFInstructor
  onPress?: () => any
}

const InstructorRow: React.FC<Props> = ({ instructor, onPress, isAdded }) => {
  const { space } = useTheme()
  return (
    <Pressable
      isDisabled={isAdded}
      onPress={onPress}
      paddingY={space['1']}
      _hover={
        (isAdded && {
          bgColor: 'primary.100'
        }) ||
        undefined
      }
      borderBottomWidth="1"
      borderBottomColor={'gray.300'}>
      <Column marginLeft={space['1']}>
        <Text color={isAdded ? 'gray.500' : 'darkText'}>
          {instructor.firstname} {instructor.lastname}
        </Text>

        {isAdded && (
          <Text fontSize="sm" opacity={isAdded ? 1 : 0}>
            Du hast diese Person bereits hinzugefügt.
          </Text>
        )}
      </Column>
    </Pressable>
  )
}
export default InstructorRow
