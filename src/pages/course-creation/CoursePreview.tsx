import { gql, useMutation } from '@apollo/client'
import { VStack, Button, useTheme, Heading, Text, Row, Box } from 'native-base'
import { useContext } from 'react'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'
import { CreateCourseContext } from '../CreateCourse'

type Props = {
  onNext: () => any
  onBack: () => any
}

const CoursePreview: React.FC<Props> = ({ onNext, onBack }) => {
  const { space } = useTheme()
  const {
    courseName,
    subject,
    outline,
    description,
    tags,
    courseClasses,
    joinAfterStart,
    allowContact,
    lectures
  } = useContext(CreateCourseContext)

  // const [createCourse, { data, error, loading }] = useMutation(gql`
  //   mutation createCourse(
  //     $user: Float!
  //     $course: PublicCourseCreateInput!
  //     $sub: PublicSubcourseCreateInput!
  //     $lec: [PublicLectureInput!]
  //   ) {
  //     courseCreate(studentId: $user, course: $course) {
  //       id
  //     }
  //     subcourseCreate(courseId: id, subcourse: $sub}){id}
  //     lectureCreate(subcourseId: id, lecture: $lec)
  //   }
  // `)

  return (
    <VStack space={space['1']}>
      <Heading>Angaben überprüfen</Heading>
      <Text>
        Bitte überpüfe deine Angaben noch einmal, bevor du deinen Kurs
        veröffentlichst.
      </Text>

      <Heading>Allgemeine Informationen zu deinem Kurs</Heading>
      <Row>
        <Text bold>
          Kursname: <Text>{courseName}</Text>
        </Text>
      </Row>

      <Heading>Fach</Heading>
      {subject && <IconTagList isDisabled text={subject.name || ''} />}

      <Box bg="gray.500" h="180"></Box>

      <Heading>Kurzbeschreibung</Heading>
      <Text>{outline}</Text>

      <Heading>Beschreibung</Heading>
      <Text>{description}</Text>

      {tags && (
        <>
          <Heading>Tags</Heading>
          <Row>
            {tags.split(',').map(t => (
              <IconTagList text={t} />
            ))}
          </Row>
        </>
      )}

      <Heading>Klassen</Heading>
      {courseClasses &&
        courseClasses.map(c => <IconTagList isDisabled text={`${c}`} />)}

      <Row>
        <Text bold>
          Teilnehmerzahl: <Text>Max {courseName}</Text>
        </Text>
      </Row>
      <Row>
        <Text bold>
          Beitreten nach Kursbeginn:{' '}
          <Text>{joinAfterStart ? 'Ja' : 'Nein'}</Text>
        </Text>
      </Row>
      <Row>
        <Text bold>
          Kontaktaufnahme erlauben: <Text>{allowContact ? 'Ja' : 'Nein'}</Text>
        </Text>
      </Row>

      <Heading>Termine zum Kurs</Heading>
      {lectures && lectures.map(lec => null)}

      <Button onPress={onNext}>Kurs veröffentlichen</Button>
      <Button variant={'outline'} onPress={onBack}>
        Daten bearbeiten
      </Button>
    </VStack>
  )
}
export default CoursePreview
