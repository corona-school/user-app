import {
  useTheme,
  Text,
  View,
  Box,
  Container,
  Row,
  Column,
  Link
} from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import WithNavigation from '../../components/WithNavigation'

type Props = {}

const OnBoardingMatching: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <View backgroundColor="primary.100" height="100%">
        <WithNavigation
          headerTitle="1:1 Matching"
          headerContent={
            <>
              <Container maxWidth="100%">
                <Box width="100%">
                  <View
                    paddingX={space['1']}
                    paddingBottom={space['1']}
                    color="lightText"
                    alignItems="center"
                    borderBottomRadius="15px"
                    backgroundColor="primary.700">
                    <Text color="lightText" textAlign="center" maxWidth="278px">
                      Die 1:1 Lernunterstützung ist eine 1:1 Betreuung für
                      Schüler:innen die individuelle Hilfe benötigen. Unter
                      diesem Punkt findest du deine Termine, deine
                      Lernparter:innen, siehst deine angefragten Matches und
                      kannst neue Matches anfordern.
                    </Text>
                  </View>
                </Box>
                <Box width="100%" padding={space['1']}></Box>
              </Container>
              <Container padding={space['1']} maxWidth="100%">
                <Row justifyContent="space-between" width="100%">
                  <Column>
                    <Link
                      _text={{
                        color: 'primary.400',
                        fontWeight: 600
                      }}
                      onPress={() => navigate('/')}>
                      Überspringen
                    </Link>
                  </Column>
                  <Column>
                    <Link
                      _text={{
                        color: 'primary.900',
                        fontWeight: 600
                      }}
                      onPress={() => navigate('/')}>
                      Weiter
                    </Link>
                  </Column>
                </Row>
              </Container>
            </>
          }
        />
      </View>
    </>
  )
}
export default OnBoardingMatching
