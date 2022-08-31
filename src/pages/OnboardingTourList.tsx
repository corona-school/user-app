import {
  Button,
  Text,
  Heading,
  useTheme,
  VStack,
  CheckCircleIcon,
  Stagger
} from 'native-base'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import NotificationAlert from '../components/NotificationAlert'
import WithNavigation from '../components/WithNavigation'
import CTACard from '../widgets/CTACard'

type Props = {}

const OnboardingTourList: React.FC<Props> = () => {
  const { space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <WithNavigation
      headerTitle={t('onboardingList.header')}
      headerLeft={<BackButton />}
      headerRight={<NotificationAlert />}>
      <VStack paddingTop={space['4']} paddingBottom={7} paddingX={space['1.5']}>
        <Heading paddingBottom={space['0.5']}>
          {t('onboardingList.title')}
        </Heading>
        <Text maxWidth={330}>{t('onboardingList.content')}</Text>
      </VStack>
      <VStack paddingX={space['1.5']} paddingBottom={space['2']}>
        <Stagger
          initial={{ opacity: 0, translateY: 20 }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { stagger: { offset: 60 }, duration: 500 }
          }}
          visible>
          {new Array(5).fill(0).map(({}, index) => (
            <CTACard
              key={`card-${index}`}
              marginBottom={space['1']}
              variant="dark"
              title={t(`onboardingList.cards.card${index}.title`)}
              closeable={false}
              content={
                <Text>{t(`onboardingList.cards.card${index}.content`)}</Text>
              }
              button={
                <Button
                  onPress={() =>
                    navigate(t(`onboardingList.cards.card${index}.url`))
                  }>
                  {t(`onboardingList.buttontext`)}
                </Button>
              }
              icon={<CheckCircleIcon size="10" />}
            />
          ))}
        </Stagger>
      </VStack>
    </WithNavigation>
  )
}
export default OnboardingTourList
