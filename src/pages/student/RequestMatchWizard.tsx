import {
  Text,
  VStack,
  Heading,
  FormControl,
  TextArea,
  Button,
  useTheme,
  Link
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
  const navigate = useNavigate()

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
    <VStack paddingX={space['1']}>
      <Heading paddingBottom={space['0.5']}>
        {t('matching.request.check.title')}
      </Heading>
      <Text paddingBottom={space['0.5']}>
        {t('matching.request.check.content')}
      </Text>
      <Text mt="1" bold>
        {t('matching.request.check.contentHeadline')}
      </Text>
      <Text paddingBottom={space['1']}>
        {t('matching.request.check.contenHeadlineContent')}
      </Text>
      <Heading fontSize="md" paddingBottom={space['1']}>
        {t('matching.request.check.personalDataHeadline')}
      </Heading>
      <Text bold paddingBottom={space['0.5']}>
        {t('matching.request.check.personalDataQuestion')}
      </Text>
      <Text>{t('matching.request.check.personalDataAnswer')}</Text>
      <TwoColGrid>
        {data?.me?.student?.subjectsFormatted.map((sub: any) => (
          <IconTagList
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
      <FormControl marginBottom={space['1']}>
        <FormControl.Label _text={{ color: 'primary.700' }}>
          {t('matching.request.check.descLabel')}
        </FormControl.Label>
        <TextArea
          placeholder={t('matching.request.check.descPlaceholder')}
          autoCompleteType={{}}
          onChangeText={setDescription}
          value={description}
        />
      </FormControl>

      <VStack marginBottom={space['1']}>
        <Link onPress={() => alert('hallo')} _text={{ fontWeight: 700 }}>
          {t('matching.request.check.editDataLabel')}
        </Link>
      </VStack>

      <Button
        isDisabled={isValidInput}
        onPress={() => setCurrentIndex(1)}
        marginBottom={space['1']}>
        {t('matching.request.check.buttons.button1')}
      </Button>
      <Button
        variant="outline"
        onPress={() => navigate(-1)}
        marginBottom={space['1']}>
        {t('matching.request.check.buttons.button2')}
      </Button>
    </VStack>
  )
}
export default RequestMatchWizard
