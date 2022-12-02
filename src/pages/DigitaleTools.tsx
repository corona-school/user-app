import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Box, Heading, useTheme, Text } from 'native-base'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BackButton from '../components/BackButton'
import WithNavigation from '../components/WithNavigation'
import WebServiceCard from '../widgets/WebServiceCard'

type Props = {}

const DigitaleTools: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Digitale Tools'
    })
  }, [])

  return (
    <WithNavigation headerTitle={t('digitaletools.header')} showBack>
      <Box paddingTop={space['4']} paddingX={space['1.5']}>
        <Heading paddingBottom={1.5}>{t('digitaletools.title')}</Heading>
        <Text paddingBottom={space['1']}>{t('digitaletools.content')}</Text>
      </Box>
      {new Array(3).fill(0).map(({}, index) => (
        <Box
          key={'digitaletools-' + index}
          paddingX={space['1.5']}
          paddingY={space['1']}>
          {/* @TODO: Tags */}
          <WebServiceCard
            title={t(`digitaletools.cards.card${index}.title`)}
            description={t(`digitaletools.cards.card${index}.content`)}
            image={t(`digitaletools.cards.card${index}.image`)}
            url={t(`digitaletools.cards.card${index}.url`)}
            tags={['Hallo', 'Test']}
            pros={['Hallo', 'Test']}
            contra={['Hallo', 'Test']}
          />
        </Box>
      ))}
    </WithNavigation>
  )
}
export default DigitaleTools
