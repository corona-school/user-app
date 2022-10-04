import { View, Text, Heading, Row, useTheme, Button, Box } from 'native-base'
import { useTranslation } from 'react-i18next'
import Card from '../components/Card'
import InstructionProgress from './InstructionProgress'

type Props = {
  index?: number
}

const HelperWizard: React.FC<Props> = ({ index }) => {
  const { space } = useTheme()
  const { t } = useTranslation()

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
                      <>
                        <Box>
                          <Text marginBottom={space['1']}>
                            {t('helperwizard.kennenlernen.content')}
                          </Text>
                          <Button>
                            {t('helperwizard.kennenlernen.button')}
                          </Button>
                        </Box>
                      </>
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
                      <>
                        <Box flexDirection="row" marginBottom={space['0.5']}>
                          <Text marginRight="5px">
                            {t('helperwizard.zeugnis.einreichen')}
                          </Text>
                          <Text bold color="primary.400">
                            tt.mm.jjjj
                          </Text>
                        </Box>
                        <Box>
                          <Text marginBottom={space['1']}>
                            {t('helperwizard.zeugnis.content')}
                          </Text>
                          <Button>{t('helperwizard.zeugnis.button')}</Button>
                        </Box>
                      </>
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
                      <>
                        <Box>
                          <Text marginBottom={space['1']}>
                            {t('helperwizard.angebot.content')}
                          </Text>
                          <Button>{t('helperwizard.angebot.button')}</Button>
                        </Box>
                      </>
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
                      <>
                        <Box>
                          <Text marginBottom={space['1']}>
                            {t('helperwizard.zeugnisHochladen.content')}
                          </Text>
                          <Button>
                            {t('helperwizard.zeugnisHochladen.button')}
                          </Button>
                        </Box>
                      </>
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
