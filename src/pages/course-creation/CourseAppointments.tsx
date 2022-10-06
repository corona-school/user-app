import { graphqlSync } from 'graphql'
import {
  VStack,
  Button,
  useTheme,
  Heading,
  Text,
  Row,
  Box,
  Pressable
} from 'native-base'
import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CreateCourseContext } from '../CreateCourse'
import CourseDateWizard from './CourseDateWizard'

type Props = {
  onNext: () => any
  onBack: () => any
}

const CourseAppointments: React.FC<Props> = ({ onNext, onBack }) => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const { lectures, setLectures } = useContext(CreateCourseContext)

  const isValidInput = useMemo(() => {
    if (!lectures || !lectures.length) return false
    for (const lec of lectures) {
      if (!lec.date) return false
      if (!lec.time) return false
      if (!lec.duration) return false
    }
    return true
  }, [lectures])

  useEffect(() => {
    if (lectures?.length === 0) {
      setLectures &&
        setLectures(prev => [...prev, { time: '', duration: '', date: '' }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <VStack space={space['1']}>
      <Heading>{t('course.appointments.headline')}</Heading>
      <Text bold>{t('course.appointments.content')}</Text>

      {lectures?.map((lec, i) => (
        <Row>
          <CourseDateWizard index={i} />
        </Row>
      ))}

      <VStack>
        <Pressable
          isDisabled={!isValidInput}
          onPress={() => {
            setLectures &&
              setLectures(prev => [
                ...prev,
                { time: '', date: '', duration: '' }
              ])
          }}>
          <Row>
            <Box
              bg={isValidInput ? 'primary.900' : 'gray.500'}
              w="32px"
              h="32px"></Box>
            <Text color={isValidInput ? 'darkText' : 'gray.500'}>
              {t('course.appointments.addOtherAppointment')}
            </Text>
          </Row>
        </Pressable>
        {!isValidInput && (
          <Text color={'gray.500'} fontSize={'sm'}>
            Bitte fülle alle vorigen Termine korrekt aus.
          </Text>
        )}
      </VStack>

      <Button isDisabled={!isValidInput} onPress={onNext}>
        {t('course.appointments.check')}
      </Button>
      <Button variant={'outline'}>{t('course.appointments.saveDraft')}</Button>
      <Button variant={'outline'} onPress={onBack}>
        {t('course.appointments.prevPage')}
      </Button>
    </VStack>
  )
}
export default CourseAppointments
