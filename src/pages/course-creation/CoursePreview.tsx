import { VStack, Button, useTheme } from 'native-base'
import { useContext } from 'react'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onBack: () => any
}

const CoursePreview: React.FC<Props> = ({ onNext, onBack }) => {
  const { space } = useTheme()
  const data = useContext(CreateCourseContext)

  return (
    <VStack space={space['1']}>
      <Button onPress={onNext}>Kurs veröffentlichen</Button>
      <Button variant={'outline'} onPress={onBack}>
        Daten bearbeiten
      </Button>
    </VStack>
  )
}
export default CoursePreview
