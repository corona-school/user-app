import { Text, VStack, Heading, Button, useTheme } from 'native-base'

type Props = {
  email?: string
}

const VerifyEmailModal: React.FC<Props> = ({ email }) => {
  const { space } = useTheme()

  return (
    <VStack space={space['1']} p={space['1']} flex="1" alignItems="center">
      <Heading size="md" textAlign="center" color="white">
        Fast geschafft!
      </Heading>
      {email && (
        <>
          <Text>{`Wir haben eine E-Mail an`}</Text>
          <Text>{email} gesendet. </Text>
        </>
      )}
      <Text>
        Bevor du unser Angebot nutzen kannst, musst du deine E-Mailadresse
        bestätigen und den AGB zustimmen. Wenn du deine E-Mailadresse bestätigt
        hast, wirst du automatisch weitergeleitet.
      </Text>
      <Text bold>Keine E-Mail erhalten?</Text>
      <Button variant={'link'}>Erneut senden</Button>
    </VStack>
  )
}
export default VerifyEmailModal
