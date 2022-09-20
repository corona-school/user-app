import { t } from 'i18next'
import {
  Row,
  Box,
  useTheme,
  Modal,
  Heading,
  Text,
  Button,
  Image,
  CloseIcon
} from 'native-base'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import WarningIcon from '../assets/icons/lernfair/ic_warning.svg'

type Props = {
  title?: string
  content?: string
  defaultButtonText?: string
  defaultButtonLink?: string

  outlineButtonText?: string
  outlineButtonLink?: string

  onPressClose?: () => any
  onPressDefaultButton?: () => any
  onPressOutlineButton?: () => any
}

const OnBoardingSkipModal: React.FC<Props> = ({
  title,
  content,
  defaultButtonText,
  defaultButtonLink,

  outlineButtonText,
  outlineButtonLink,
  onPressClose,
  onPressDefaultButton,
  onPressOutlineButton
}) => {
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <>
      <Modal.Content width="284px" marginX="auto">
        <Box position="absolute" zIndex="1" right="20px" top="14px">
          <Pressable onPress={onPressClose}>
            <CloseIcon color="white" />
          </Pressable>
        </Box>
        <Modal.Body background="primary.900" padding={space['1']}>
          <Box alignItems="center" marginY={space['1']}>
            <WarningIcon />
          </Box>
          <Box paddingY={space['1']}>
            <Heading
              maxWidth="330px"
              marginX="auto"
              fontSize="md"
              textAlign="center"
              color="lightText"
              marginBottom={space['0.5']}>
              Hallo
            </Heading>
            <Text
              textAlign="center"
              color="lightText"
              maxWidth="330px"
              marginX="auto">
              Du kannst die Tour auch jederzeit neu starten. Du findest den
              Punkt unter deinen Einstellungen als Punkt „Onboarding“.
            </Text>
          </Box>
          <Box paddingY={space['1']}>
            <Row marginBottom={space['0.5']}>
              <Button onPress={onPressDefaultButton} width="100%">
                Nein, Tour beginnen
              </Button>
            </Row>
            <Row>
              <Button
                onPress={onPressOutlineButton}
                width="100%"
                variant="outlinelight">
                Ja, Tour überspringen
              </Button>
            </Row>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </>
  )
}
export default OnBoardingSkipModal
