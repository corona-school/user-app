import {
  Text,
  VStack,
  Heading,
  FormControl,
  TextArea,
  Button,
  useTheme
} from 'native-base'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'

type Props = {
  description: string
  selectedSubjects: any
  selectedClasses: any
  setSelectedSubjects: any
  setFocusedSubject: any
  setShowModal: any
  setDescription: any
  setCurrentIndex: any
  data: any
}

const RequestMatchWizard: React.FC<Props> = ({
  description,
  selectedSubjects,
  selectedClasses,
  setSelectedSubjects,
  setFocusedSubject,
  setShowModal,
  setDescription,
  setCurrentIndex,
  data
}) => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const isValidInput = useMemo(() => {
    if (description.length < 5) return false

    Object.entries(selectedSubjects)
      .filter(s => s[1] && s)
      .forEach(([sub, _]) => {
        if (!selectedClasses[sub].min || !selectedClasses[sub].max) {
          return false
        }
      })

    return true
  }, [description, selectedSubjects, selectedClasses])

  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <VStack>
      <Heading mb={space['0.5']}>{t('matching.student.title')}</Heading>
      <Text>{t('matching.student.text')}</Text>

      <Text my={space['0.5']} bold>
        {t('important')}
      </Text>
      <Text mb={space['1.5']}>{t('matching.student.hint')}</Text>

      <Heading fontSize={'lg'} mb={space['0.5']}>
        {t('matching.student.personalData.title')}
      </Heading>

      <Text bold>{t('matching.student.personalData.subtitle')}</Text>
      <Text>{t('matching.student.personalData.hint')}</Text>

      <TwoColGrid>
        {data?.me?.student?.subjectsFormatted.map((sub: any) => (
          <IconTagList
            iconPath={`subjects/icon_${sub?.name?.toLowerCase()}.svg`}
            variant="selection"
            text={sub.name}
            initial={selectedSubjects[sub.name]}
            onPress={() => {
              setSelectedSubjects((prev: any) => ({
                [sub.name]: !prev[sub.name]
              }))
              setFocusedSubject(sub)
              setShowModal(true)
            }}
          />
        ))}
      </TwoColGrid>

      <VStack space={space['1']}>
        <FormControl>
          <FormControl.Label>Beschreibung</FormControl.Label>
          <TextArea
            autoCompleteType={{}}
            onChangeText={setDescription}
            value={description}
          />
        </FormControl>
        <Button isDisabled={!isValidInput} onPress={() => setCurrentIndex(1)}>
          Angaben prüfen
        </Button>
        <Button variant="outline" onPress={() => navigate(-1)}>
          Abbrechen
        </Button>
      </VStack>
    </VStack>
  )
}
export default RequestMatchWizard
