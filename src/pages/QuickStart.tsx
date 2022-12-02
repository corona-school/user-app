import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Box, Heading, useTheme, Text, Column, Stagger } from 'native-base'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BackButton from '../components/BackButton'
import WithNavigation from '../components/WithNavigation'
import QuickStartCard from '../widgets/QuickStartCard'

type Props = {}

const QuickStart: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Onboarding'
    })
  }, [])

  return (
    <WithNavigation headerTitle={t('quickstart.header')} showBack>
      <Box
        paddingTop={space['4']}
        paddingBottom={space['1.5']}
        paddingX={space['1.5']}>
        <Heading paddingBottom={1.5}>{t('quickstart.title')}</Heading>
        <Text>{t('quickstart.content')}</Text>
      </Box>
      <Box width="100%" paddingX={space['1.5']}>
        <Stagger
          initial={{ opacity: 0, translateY: 20 }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { stagger: { offset: 60 }, duration: 500 }
          }}
          visible>
          {new Array(3).fill(0).map(({}, index) => (
            <Column key={index} marginBottom={space['1.5']}>
              <QuickStartCard
                image={t(`quickstart.cards.card${index}.image`)}
                title={t(`quickstart.cards.card${index}.title`)}
                readingtime={t(`quickstart.cards.card${index}.time`)}
                posttype={t(`quickstart.cards.card${index}.fileformat`)}
                url={t(`quickstart.cards.card${index}.url`)}
                description={t(`quickstart.cards.card${index}.content`)}
              />
            </Column>
          ))}
        </Stagger>
      </Box>
    </WithNavigation>
  )
}
export default QuickStart
