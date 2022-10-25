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
import { useTranslation } from 'react-i18next'
import ToggleButton from '../../components/ToggleButton'
import { LFSubject } from '../../types/lernfair/Subject'
import Utility from '../../Utility'
import IconTagList from '../../widgets/IconTagList'

type Props = {
  subjects: LFSubject[]
  classes: {
    [key: string]: { [key: string]: boolean }
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

  return (
    <VStack space={space['1']} width={ContainerWidth}>
      <Heading>{t('matching.request.check.preview.title')}</Heading>
      <Text>{t('matching.request.check.preview.content')}</Text>

      {subjects.map((sub: LFSubject, index: number) => (
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
          {Object.entries(classes[sub.name] || {}).map(
            ([key, val], index: any) => {
              const range = Utility.intToClassRange(parseInt(key))

              return (
                <ToggleButton
                  dataKey={index}
                  isActive={false}
                  label={`${range.min}. - ${range.max}. Klasse`}
                />
              )
            }
          )}
        </VStack>
      ))}
      <Text bold>{t('matching.request.check.preview.desc')}</Text>

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
