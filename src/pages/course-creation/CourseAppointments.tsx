import { graphqlSync } from 'graphql'
import {
  VStack,
  Button,
  useTheme,
  Heading,
  Text,
  Row,
  Box,
  Pressable,
  Alert,
  HStack,
  IconButton,
  CloseIcon
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
      <Heading marginBottom={space['1.5']}>
        {t('course.appointments.headline')}
      </Heading>
      <Text fontSize="md" bold>
        {t('course.appointments.content')}
      </Text>

      {lectures?.map((lec, i) => (
        <Row>
          <CourseDateWizard index={i} />
        </Row>
      ))}

      <VStack>
        <Pressable
          marginBottom={space['2']}
          isDisabled={!isValidInput}
          onPress={() => {
            setLectures &&
              setLectures(prev => [
                ...prev,
                { time: '', date: '', duration: '' }
              ])
          }}
          alignItems="center"
          flexDirection="row">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={!isValidInput ? 'primary.grey' : 'primary.800'}
            w="40px"
            h="40px"
            marginRight="15px"
            borderRadius="10px">
            <Text color="white" fontSize="32px">
              +
            </Text>
          </Box>
          <Text bold color={!isValidInput ? 'primary.grey' : 'primary.800'}>
            {t('course.appointments.addOtherAppointment')}
          </Text>
        </Pressable>

        {!isValidInput && (
          <Alert status="error" backgroundColor="#fecaca">
            <Text>{t('course.noticeDate')}</Text>
          </Alert>
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
