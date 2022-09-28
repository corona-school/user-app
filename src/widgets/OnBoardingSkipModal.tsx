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
  onPressClose?: () => any
  onPressDefaultButton?: () => any
  onPressOutlineButton?: () => any
}

const OnBoardingSkipModal: React.FC<Props> = ({
  onPressClose,
  onPressDefaultButton,
  onPressOutlineButton
}) => {
  const { space } = useTheme()
  const { t } = useTranslation()

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
              {t('onboardingList.Wizard.students.welcome.popup.title')}
            </Heading>
            <Text
              textAlign="center"
              color="lightText"
              maxWidth="330px"
              marginX="auto">
              {t('onboardingList.Wizard.students.welcome.popup.content')}
            </Text>
          </Box>
          <Box paddingY={space['1']}>
            <Row marginBottom={space['0.5']}>
              <Button onPress={onPressDefaultButton} width="100%">
                {t(
                  'onboardingList.Wizard.students.welcome.popup.defaultButtonText'
                )}
              </Button>
            </Row>
            <Row>
              <Button
                onPress={onPressOutlineButton}
                width="100%"
                variant="outlinelight">
                {t(
                  'onboardingList.Wizard.students.welcome.popup.outlineButtonText'
                )}
              </Button>
            </Row>
          </Box>
        </Modal.Body>
      </Modal.Content>
    </>
  )
}
export default OnBoardingSkipModal
