import {
  View,
  Text,
  Heading,
  Row,
  useTheme,
  Button,
  Box,
  useBreakpointValue,
  Column
} from 'native-base'
import { useTranslation } from 'react-i18next'
import Card from '../components/Card'
import InstructionProgress from './InstructionProgress'

type Props = {
  index?: number
}

const HelperWizard: React.FC<Props> = ({ index }) => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const ButtonDirection = useBreakpointValue({
    base: 'column',
    lg: 'row'
  })

  const ButtonSpace = useBreakpointValue({
    base: 0,
    lg: '25px'
  })

  const ContentsDirection = useBreakpointValue({
    base: 'flex-start',
    lg: 'center'
  })

  return (
    <View>
      <Card variant="dark" flexibleWidth>
        <Row padding="30px" flexDirection="column">
          <Heading fontSize="lg" color="lightText" marginBottom="17px">
            {t('helperwizard.nextStep')}
          </Heading>

          <InstructionProgress
            currentIndex={index}
            isDark={true}
            instructions={[
              {
                label: t('helperwizard.kennenlernen.label'),
                title: '',
                content: [
                  {
                    title: t('helperwizard.kennenlernen.title'),
                    text: (
                      <Box
                        flexDir={ButtonDirection}
                        alignItems={ContentsDirection}
                        width="100%"
                        justifyContent="space-between">
                        <Text
                          display="block"
                          maxWidth="500px"
                          marginBottom={space['1']}>
                          {t('helperwizard.kennenlernen.content')}
                        </Text>
                        <Button
                          width={ButtonContainer}
                          marginRight={ButtonSpace}
                          marginBottom={space['2']}>
                          {t('helperwizard.kennenlernen.button')}
                        </Button>
                      </Box>
                    )
                  }
                ]
              },
              {
                label: t('helperwizard.zeugnis.label'),
                title: '',
                content: [
                  {
                    title: t('helperwizard.zeugnis.title'),
                    text: (
                      <Box width="100%">
                        <Box
                          flexDirection="row"
                          marginBottom={space['0.5']}
                          display="block"
                          maxWidth="500px">
                          <Text marginRight="5px">
                            {t('helperwizard.zeugnis.einreichen')}
                          </Text>
                          <Text bold color="primary.400">
                            tt.mm.jjjj
                          </Text>
                        </Box>
                        <Box
                          flexDir={ButtonDirection}
                          alignItems={ContentsDirection}
                          width="100%"
                          justifyContent="space-between">
                          <Column>
                            <Text maxWidth="500px" marginBottom={space['1']}>
                              {t('helperwizard.zeugnis.content')}
                            </Text>
                          </Column>
                          <Column>
                            <Button
                              overflow="visible"
                              width={ButtonContainer}
                              marginRight={ButtonSpace}
                              marginBottom={space['2']}>
                              {t('helperwizard.zeugnis.button')}
                            </Button>
                          </Column>
                        </Box>
                      </Box>
                    )
                  }
                ]
              },
              {
                label: t('helperwizard.angebot.label'),
                title: '',
                content: [
                  {
                    title: t('helperwizard.angebot.title'),
                    text: (
                      <Box width="100%">
                        <Box
                          flexDir={ButtonDirection}
                          alignItems={ContentsDirection}
                          width="100%"
                          justifyContent="space-between">
                          <Column>
                            <Text maxWidth="500px" marginBottom={space['1']}>
                              {t('helperwizard.angebot.content')}
                            </Text>
                          </Column>
                          <Column>
                            <Button
                              width={ButtonContainer}
                              marginRight={ButtonSpace}
                              marginBottom={space['2']}>
                              {t('helperwizard.angebot.button')}
                            </Button>
                          </Column>
                        </Box>
                      </Box>
                    )
                  }
                ]
              },
              {
                label: t('helperwizard.zeugnisHochladen.label'),
                title: '',
                content: [
                  {
                    title: t('helperwizard.zeugnisHochladen.title'),
                    text: (
                      <Box width="100%">
                        <Box
                          flexDir={ButtonDirection}
                          alignItems={ContentsDirection}
                          width="100%"
                          justifyContent="space-between">
                          <Column>
                            <Text maxWidth="500px" marginBottom={space['1']}>
                              {t('helperwizard.zeugnisHochladen.content')}
                            </Text>
                          </Column>
                          <Column>
                            <Button
                              width={ButtonContainer}
                              marginRight={ButtonSpace}
                              marginBottom={space['2']}>
                              {t('helperwizard.zeugnisHochladen.button')}
                            </Button>
                          </Column>
                        </Box>
                      </Box>
                    )
                  }
                ]
              }
            ]}
          />
        </Row>
      </Card>
    </View>
  )
}
export default HelperWizard
