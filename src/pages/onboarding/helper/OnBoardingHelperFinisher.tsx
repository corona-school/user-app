import {
  useTheme,
  Text,
  View,
  Container,
  Row,
  Column,
  Heading,
  Image,
  Button
} from 'native-base'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Logo from '../../../assets/icons/lernfair/lf-logo-big.svg'

type Props = {}

const OnBoardingHelperFinisher: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Fragment>
      <View
        position="relative"
        backgroundColor="primary.400"
        height="100%"
        justifyContent="center">
        <Image
          alt="Lernfair"
          position="absolute"
          width="100%"
          height="100%"
          source={{ uri: require('../../../assets/images/globals/lf-bg.png') }}
        />
        <Container maxWidth="100%">
          <Row flexDirection="column" width="100%" alignItems="center">
            <Column padding={space['2']}>
              <Heading textAlign="center" marginBottom={space['0.5']}>
                {t('onboardingList.Wizard.helper.finisher.title')}
              </Heading>
              <Text
                textAlign="center"
                maxWidth="250px"
                marginBottom={space['1']}>
                {t('onboardingList.Wizard.helper.finisher.content')}
              </Text>
              <Button onPress={() => navigate('/')}>zum Dashboard</Button>
            </Column>
            <Column paddingY={space['2']}>
              <Logo />
            </Column>
          </Row>
        </Container>
      </View>
    </Fragment>
  )
}
export default OnBoardingHelperFinisher
