import { gql, useMutation } from '@apollo/client'
import {
  Text,
  VStack,
  Heading,
  Button,
  useTheme,
  useBreakpointValue,
  Flex,
  Box
} from 'native-base'
import { useCallback, useState } from 'react'
import Icon from '../assets/icons/lernfair/ic_email.svg'
import AlertMessage from '../widgets/AlertMessage'
import { DEEPLINK_OPTIN } from '../Utility'

type Props = {
  email?: string
}

const VerifyEmailModal: React.FC<Props> = ({ email }) => {
  const { space, sizes } = useTheme()
  const [showSendEmailResult, setShowSendEmailResult] = useState<
    'success' | 'error' | undefined
  >()

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const [sendVerification, _sendVerification] = useMutation(gql`
    mutation ($email: String!) {
      tokenRequest(email: $email, action: "user-verify-email", redirectTo: "${DEEPLINK_OPTIN}")
    }
  `)

  const requestEmailVerification = useCallback(async () => {
    const res = await sendVerification({
      variables: {
        email
      }
    })

    setShowSendEmailResult(res.data?.tokenRequest ? 'success' : 'error')
  }, [email, sendVerification])

  return (
    <Flex
      p={space['1']}
      flex="1"
      alignItems="center"
      justifyContent="center"
      bgColor="primary.900">
      <VStack
        w={ContentContainerWidth}
        space={space['1']}
        flex="1"
        alignItems="center">
        <Icon />
        <Heading size="md" textAlign="center" color="lightText">
          Fast geschafft!
        </Heading>
        {email && (
          <>
            <Text color="lightText">{`Wir haben eine E-Mail an`}</Text>
            <Text color="lightText">{email} gesendet. </Text>
          </>
        )}
        <Text color="lightText" textAlign={'center'}>
          Bevor du unser Angebot nutzen kannst, musst du deine E-Mailadresse
          bestätigen und den AGB zustimmen. Wenn du deine E-Mailadresse
          bestätigt hast, wirst du automatisch weitergeleitet.
        </Text>
        <Text bold color="lightText">
          Keine E-Mail erhalten?
        </Text>
        <Button
          isDisabled={_sendVerification?.loading}
          onPress={requestEmailVerification}
          variant={'link'}>
          Erneut senden
        </Button>
        {showSendEmailResult && (
          <Box width="100%">
            <AlertMessage
              content={
                showSendEmailResult === 'success'
                  ? 'Wir haben dir eine E-Mail gesendet. Bitte überprüfe deinen Posteingang.'
                  : 'Leider ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
              }
            />
          </Box>
        )}
      </VStack>
    </Flex>
  )
}
export default VerifyEmailModal
