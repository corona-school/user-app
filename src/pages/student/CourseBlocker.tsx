import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  useTheme,
  Image,
  Link,
  useBreakpointValue
} from 'native-base'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LFIconBook from '../../assets/icons/lernfair/onboarding/lf-onboarding-group.svg'
import LFImageLearing from '../../assets/images/course/course-blocker.jpg'
import BackButton from '../../components/BackButton'
import WithNavigation from '../../components/WithNavigation'
import CTACard from '../../widgets/CTACard'
import HelperWizard from '../../widgets/HelperWizard'

type Props = {}

const CourseBlocker: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Kurse Blocker'
    })
  }, [])

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  return (
    <>
      <Container
        maxWidth={ContainerWidth}
        width="100%"
        marginX="auto"
        paddingX={space['1.5']}
        alignItems="stretch"
        marginBottom={space['0.5']}>
        <Heading marginBottom={space['1']}>{t('course.blocker.title')}</Heading>
        <Image
          width="100%"
          height="400px"
          borderRadius="15px"
          marginBottom={space['1.5']}
          source={{
            uri: LFImageLearing
          }}
        />
        <Text maxWidth={ContentContainerWidth} marginBottom={space['1']}>
          {t('course.blocker.firstContent')}
        </Text>
        <Text maxWidth={ContentContainerWidth} marginBottom={space['1']}>
          {t('course.blocker.secContent')}
          <Link> {t('course.blocker.here')} </Link>
          {t('course.blocker.thrContent')}
        </Text>
        <Text maxWidth={ContentContainerWidth} bold marginBottom="4px">
          {t('course.blocker.contentHeadline')}
        </Text>
        <Text maxWidth={ContentContainerWidth} marginBottom={space['1']}>
          {t('course.blocker.content')}
        </Text>
      </Container>
      <Container
        maxWidth={ContainerWidth}
        width="100%"
        marginX="auto"
        paddingX={space['1.5']}
        marginBottom={space['1.5']}
        alignItems="stretch">
        <CTACard
          width="100%"
          variant="dark"
          title={t('course.blocker.cta.title')}
          content={t('course.blocker.cta.content')}
          icon={<LFIconBook />}
          button={<Button>{t('course.blocker.cta.button')}</Button>}
        />
      </Container>
      <Container
        maxWidth={ContainerWidth}
        width="100%"
        marginX="auto"
        paddingX={space['1.5']}
        marginBottom={space['1.5']}
        alignItems="stretch">
        <HelperWizard />
      </Container>
    </>
  )
}
export default CourseBlocker
