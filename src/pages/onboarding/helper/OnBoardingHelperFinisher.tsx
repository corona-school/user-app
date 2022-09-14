import {
  useTheme,
  Text,
  View,
  Container,
  Row,
  Column,
  Heading
} from 'native-base'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from '../../../assets/icons/lernfair/lf-logo.svg'

type Props = {}

const OnBoardingHelperFinisher: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <Fragment>
      <View backgroundColor="primary.400" height="100%" justifyContent="center">
        <Container maxWidth="100%">
          <Row flexDirection="column" width="100%" alignItems="center">
            <Column padding={space['2']}>
              <Heading textAlign="center" marginBottom={space['0.5']}>
                {t('onboardingList.Wizard.helper.finisher.title')}
              </Heading>
              <Text textAlign="center" maxWidth="250px">
                {t('onboardingList.Wizard.helper.finisher.content')}
              </Text>
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
