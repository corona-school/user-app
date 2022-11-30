import { t } from 'i18next'
import {
  Box,
  CloseIcon,
  Heading,
  Modal,
  Pressable,
  Text,
  Row,
  Button,
  useTheme
} from 'native-base'
import { useTranslation } from 'react-i18next'

type Props = {
  onPressClose?: () => any
  header: string
  body: string
  icon: JSX.Element
}

const InformationModal: React.FC<Props> = ({
  onPressClose,
  header,
  body,
  icon
}) => {
  const { t } = useTranslation()
  const { space } = useTheme()
  return (
    <>
      <Modal.Content width="307px" marginX="auto" backgroundColor="transparent">
        <Box position="absolute" zIndex="1" right="20px" top="14px">
          <Pressable onPress={onPressClose}>
            <CloseIcon color="white" />
          </Pressable>
        </Box>
        <Modal.Body background="primary.900" padding={space['1']}>
          <Box alignItems="center" marginY={space['1']}>
            {icon}
          </Box>
          <Box paddingY={space['1']}>
            <Heading
              maxWidth="330px"
              marginX="auto"
              fontSize="md"
              textAlign="center"
              color="lightText"
              marginBottom={space['0.5']}>
              {header}
            </Heading>
            <Text
              textAlign="center"
              color="lightText"
              maxWidth="330px"
              marginX="auto">
              {body}
            </Text>
          </Box>
          <Box paddingY={space['1']}>
            <Row marginBottom={space['0.5']}>
              <Button onPress={onPressClose} width="100%">
                {t('notification.closeButton')}
              </Button>
            </Row>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </>
  )
}

export default InformationModal
