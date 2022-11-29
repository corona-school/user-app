import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  VStack,
  Button,
  useTheme,
  Heading,
  Text,
  Row,
  Box,
  Pressable,
  useBreakpointValue
} from 'native-base'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AlertMessage from '../../widgets/AlertMessage'

import { CreateCourseContext } from '../CreateCourse'
import CourseDateWizard from './CourseDateWizard'

type Props = {
  onNext: () => any
  onBack: () => any
}

const CourseAppointments: React.FC<Props> = ({ onNext, onBack }) => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const { lectures, setLectures } = useContext(CreateCourseContext)
  const [showError, setShowError] = useState<boolean>()

  const isValidInput = useMemo(() => {
    if (!lectures || !lectures.length) return false
    for (const lec of lectures) {
      if (!lec.date) return false
      if (!lec.time) return false
      if (!lec.duration) return false
    }
    return true
  }, [lectures])

  const tryNext = useCallback(() => {
    if (isValidInput) {
      onNext()
    } else {
      setShowError(true)
    }
  }, [isValidInput, onNext])

  useEffect(() => {
    if (lectures?.length === 0) {
      setLectures &&
        setLectures(prev => [...prev, { time: '', duration: '', date: '' }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const ButtonContainerDirection = useBreakpointValue({
    base: 'column',
    lg: 'row'
  })

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Kurs erstellen – Termine'
    })
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
        <Row maxWidth={ContainerWidth}>
          <CourseDateWizard index={i} prefill={lec} />
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

        {showError && <AlertMessage content={t('course.noticeDate')} />}
      </VStack>

      <Row
        space={space['1']}
        alignItems="center"
        flexDirection={ButtonContainerDirection}>
        <Button
          marginBottom={space['1']}
          width={ButtonContainer}
          onPress={tryNext}>
          {t('course.appointments.check')}
        </Button>

        <Button
          marginBottom={space['1']}
          width={ButtonContainer}
          variant={'outline'}
          onPress={onBack}>
          {t('course.appointments.prevPage')}
        </Button>
      </Row>
    </VStack>
  )
}
export default CourseAppointments
