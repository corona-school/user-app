import {
  Text,
  Column,
  Box,
  Row,
  Button,
  useTheme,
  useBreakpointValue,
  Heading
} from 'native-base'
import { useTranslation } from 'react-i18next'
import Tag from '../components/Tag'
import { LFSubject } from '../types/lernfair/Subject'

type Props = {
  cancelLoading: boolean
  subjects: LFSubject[]
  showCancelMatchRequestModal: () => void
  index: number
  onEditRequest: () => void
}

const OpenMatchRequest: React.FC<Props> = ({
  cancelLoading,
  subjects,
  showCancelMatchRequestModal,
  index,
  onEditRequest
}) => {
  const { space } = useTheme()
  const { t } = useTranslation()

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '48%'
  })

  return (
    <Column width={CardGrid} marginRight="15px" marginBottom="15px">
      <Box bgColor="primary.100" padding={space['1.5']} borderRadius={8}>
        <Heading color="darkText" paddingLeft={space['1']}>
          {t('matching.request.check.request')}{' '}
          {`${index + 1}`.padStart(2, '0')}
        </Heading>

        <Column mt="3" paddingLeft={space['1']} space={space['0.5']}>
          <Text color="darkText" bold>
            {t('matching.request.check.subjects')}
          </Text>
          <Row space={space['0.5']}>
            {subjects &&
              subjects.map((sub: LFSubject) => (
                <Tag
                  text={sub.name}
                  variant="secondary-light"
                  marginBottom={0}
                />
              ))}
          </Row>
        </Column>
        <Button
          isDisabled={cancelLoading}
          variant="outlinelight"
          mt="3"
          color="darkText"
          onPress={showCancelMatchRequestModal}
          _text={{
            color: 'darkText'
          }}>
          {t('matching.request.check.removeRequest')}
        </Button>
        <Button
          mt={space['0.5']}
          variant="link"
          _text={{
            color: 'darkText'
          }}
          onPress={onEditRequest}>
          Anfrage bearbeiten
        </Button>
      </Box>
    </Column>
  )
}
export default OpenMatchRequest
