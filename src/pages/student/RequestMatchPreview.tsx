import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { t } from 'i18next'
import {
  Text,
  VStack,
  Heading,
  Button,
  useTheme,
  useBreakpointValue,
  Row
} from 'native-base'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ToggleButton from '../../components/ToggleButton'
import { ClassRange } from '../../types/lernfair/SchoolClass'
import { LFSubject } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'

type Props = {
  subjects: LFSubject[]
  classes: {
    [key: string]: ClassRange
  }
  onRequestMatch: () => any
  onBack: () => any
  disableButton: boolean
  disableReason: string
}

const RequestMatchPreview: React.FC<Props> = ({
  subjects,
  classes,
  onRequestMatch,
  onBack,
  disableButton,
  disableReason
}) => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()

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
      documentTitle: 'Anfrage – Helfer Matching Vorschau '
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(classes)
  return (
    <VStack marginX="auto" space={space['1']} maxWidth={ContainerWidth}>
      <Heading>{t('matching.request.check.preview.title')}</Heading>
      <Text>{t('matching.request.check.preview.content')}</Text>

      {subjects.map((sub: LFSubject, index: number) => {
        return (
          <VStack paddingBottom={space['1']}>
            <Text bold>
              {t('matching.request.check.preview.subject')} {index + 1}
            </Text>
            <IconTagList
              variant="center"
              text={sub.name}
              isDisabled
              iconPath={`subjects/icon_${sub?.name?.toLowerCase()}.svg`}
            />
            <Text paddingTop={space['1']} bold>
              {t('matching.request.check.preview.subjectForClass')} {index + 1}
            </Text>

            <ToggleButton
              dataKey={`${index}`}
              isActive={false}
              label={`${classes[sub.name] && classes[sub.name].min}. - ${
                classes[sub.name] && classes[sub.name].max
              }. Klasse`}
            />
          </VStack>
        )
      })}

      <Row
        space={space['1']}
        alignItems="center"
        flexDirection={ButtonContainerDirection}>
        <Button
          marginBottom={space['1']}
          width={ButtonContainer}
          onPress={onRequestMatch}
          isDisabled={disableButton}>
          {t('matching.request.check.preview.requestMatch')}
        </Button>
        {disableButton && <Text>{disableReason}</Text>}
        <Button
          marginBottom={space['1']}
          width={ButtonContainer}
          variant={'outline'}
          onPress={onBack}>
          {t('matching.request.check.preview.editData')}
        </Button>
      </Row>
    </VStack>
  )
}
export default RequestMatchPreview
