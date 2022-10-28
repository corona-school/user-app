import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Text,
  VStack,
  Heading,
  Button,
  useTheme,
  useBreakpointValue,
  Row,
  Container
} from 'native-base'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'

type Props = {
  selectedSubjects: any
  selectedClasses: any
  setSelectedSubjects: any
  setFocusedSubject: any
  setShowModal: any
  setCurrentIndex: any
  data: any
}

const RequestMatchWizard: React.FC<Props> = ({
  selectedSubjects,
  selectedClasses,
  setSelectedSubjects,
  setFocusedSubject,
  setShowModal,
  setCurrentIndex,
  data
}) => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const isValidInput = useMemo(() => {
    const entries = Object.entries(selectedSubjects)
    if (!entries.length) {
      return false
    }

    entries
      .filter(s => s[1] && s)
      .forEach(([sub, _]) => {
        if (
          !selectedClasses[sub] ||
          !selectedClasses[sub].min ||
          !selectedClasses[sub].max
        ) {
          return false
        }
      })

    return true
  }, [selectedSubjects, selectedClasses])

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

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Anfrage – Helfer Matching Formular '
    })
  }, [])

  return (
    <VStack maxWidth={ContainerWidth}>
      <Heading mb={space['0.5']}>{t('matching.student.title')}</Heading>
      <Text>{t('matching.student.text')}</Text>

      <Text my={space['0.5']} bold>
        {t('important')}
      </Text>
      <Text mb={space['1.5']}>{t('matching.student.hint')}</Text>

      <Heading fontSize={'lg'} mb={space['1']}>
        {t('matching.student.personalData.title')}
      </Heading>

      <Text bold paddingBottom="2px">
        {t('matching.student.personalData.subtitle')}
      </Text>
      <Text paddingBottom={space['1']}>
        {t('matching.student.personalData.hint')}
      </Text>
      <TwoColGrid>
        {data?.me?.student?.subjectsFormatted.map((sub: any) => {
          return (
            <IconTagList
              iconPath={`subjects/icon_${sub?.name?.toLowerCase()}.svg`}
              variant="selection"
              text={sub.name}
              initial={selectedSubjects[sub.name]}
              onPress={() => {
                if (selectedSubjects[sub.name]) {
                  setSelectedSubjects((prev: any) => ({
                    ...prev,
                    [sub.name]: false
                  }))
                  return
                }

                setSelectedSubjects((prev: any) => ({
                  [sub.name]: !prev[sub.name]
                }))
                setFocusedSubject(sub)
                setShowModal(true)
              }}
            />
          )
        })}
      </TwoColGrid>

      <Row
        marginY={space['1.5']}
        space={space['1']}
        alignItems="center"
        flexDirection={ButtonContainerDirection}>
        <Button
          isDisabled={!isValidInput}
          onPress={() => setCurrentIndex(1)}
          width={ButtonContainer}>
          Angaben prüfen
        </Button>
        <Button
          variant="outline"
          onPress={() => {
            trackEvent({
              category: 'matching',
              action: 'click-event',
              name: 'Helfer Matching Gruppen – Kurs erstellen',
              documentTitle: 'Matching Gruppen Lernunterstützung Kurs erstellen'
            })
            navigate('/matching')
          }}
          width={ButtonContainer}>
          Abbrechen
        </Button>
      </Row>
    </VStack>
  )
}
export default RequestMatchWizard
