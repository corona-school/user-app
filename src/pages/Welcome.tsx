import {
  View,
  useTheme,
  Row,
  VStack,
  Image,
  Heading,
  Text,
  Button,
  Box
} from 'native-base'
type Props = {}

const Welcome: React.FC<Props> = () => {
  const { colors, space } = useTheme()
  const tabspace = 3

  return (
    <View width="100vw" height="100vh" backgroundColor="primary.900">
      <VStack>
        <Row
          flexDirection="column"
          paddingY={space['4']}
          justifyContent="center"
          alignItems="center">
          <Image
            size="xl"
            source={{
              uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
            }}
          />
          <Heading
            maxWidth="220"
            textAlign="center"
            paddingTop={space['1.5']}
            paddingBottom={space['0.5']}
            color="lightText">
            Herzlich willkommen bei Lern-Fair
          </Heading>
          <Text
            paddingBottom={space['2']}
            color="lightText"
            textAlign="center"
            maxWidth="300">
            Hast du breits einen Account? Oder bist du neu bei uns und möchtest
            dich registrieren?
          </Text>
          <Box marginX="90px" marginBottom={3} display="block" width="80%">
            <Button variant="outlinelight" width="100%">
              Anmelden
            </Button>
          </Box>
          <Box marginX="90px" display="block" width="80%">
            <Button width="100%">Neu registrieren</Button>
          </Box>
        </Row>
      </VStack>
    </View>
  )
}
export default Welcome
