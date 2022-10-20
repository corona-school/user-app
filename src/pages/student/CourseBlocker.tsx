import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  useTheme,
  Image,
  Link
} from 'native-base'
import { useTranslation } from 'react-i18next'
import LFIconBook from '../../assets/icons/lernfair/onboarding/lf-onboarding-group.svg'
import LFImageLearing from '../../assets/images/course/course-blocker.jpg'
import BackButton from '../../components/BackButton'
import WithNavigation from '../../components/WithNavigation'
import CTACard from '../../widgets/CTACard'
import HelperWizard from '../../widgets/HelperWizard'

type Props = {}

const CourseBlocker: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <>
      <Container
        maxWidth="100%"
        paddingX={space['1.5']}
        alignItems="stretch"
        marginBottom={space['0.5']}>
        <Heading paddingTop="64px" marginBottom={space['1']}>
          {t('course.blocker.title')}
        </Heading>
        <Image
          width="100%"
          height="200px"
          borderRadius="15px"
          marginBottom={space['1']}
          source={{
            uri: LFImageLearing
          }}
        />
        <Text marginBottom={space['1']}>
          {t('course.blocker.firstContent')}
        </Text>
        <Text marginBottom={space['1']}>
          {t('course.blocker.secContent')}
          <Link> {t('course.blocker.here')} </Link>
          {t('course.blocker.thrContent')}
        </Text>
        <Text bold marginBottom="4px">
          {t('course.blocker.contentHeadline')}
        </Text>
        <Text marginBottom={space['1']}>{t('course.blocker.content')}</Text>
      </Container>
      <Container
        maxWidth="100%"
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
        maxWidth="100%"
        paddingX={space['1.5']}
        marginBottom={space['1.5']}
        alignItems="stretch">
        <HelperWizard />
      </Container>
    </>
  )
}
export default CourseBlocker
