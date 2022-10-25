import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  useTheme,
  Image,
  Modal,
  Row,
  CloseIcon,
  WarningIcon,
  useBreakpointValue
} from 'native-base'
import WithNavigation from '../../components/WithNavigation'
import BackButton from '../../components/BackButton'
import CTACard from '../../widgets/CTACard'
import LFIconBook from '../../assets/icons/lernfair/lf-books.svg'
import LFImageLearing from '../../assets/images/matching/1-1-matching.jpg'
import LFParty from '../../assets/icons/lernfair/lf-party.svg'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-dom'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

const MatchingBlocker: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cancelModal, setCancelModal] = useState<boolean>(false)

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const ButtonWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '55%'
  })

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Helfer Matching Blocker'
    })
  }, [])

  return (
    <>
      <Container
        maxWidth={ContainerWidth}
        paddingX={space['1.5']}
        alignItems="stretch"
        marginBottom={space['0.5']}>
        <Heading marginBottom={space['1']}>
          {t('matching.blocker.title')}
        </Heading>
        <Image
          width="100%"
          height="350px"
          borderRadius="15px"
          marginBottom={space['1']}
          source={{
            uri: LFImageLearing
          }}
        />
        <Text marginBottom={space['1']}>
          {t('matching.blocker.firstContent')}
        </Text>
        <Text bold marginBottom="4px">
          {t('matching.blocker.headlineContent')}
        </Text>
        <Text marginBottom={space['1']}>
          {t('matching.blocker.contentBox1')}
          <Text bold> {t('matching.blocker.contentBox2')} </Text>
          {t('matching.blocker.contentBox3')}
        </Text>
        <Button
          width={ButtonWidth}
          marginBottom={space['1.5']}
          variant="outline">
          {t('matching.blocker.button')}
        </Button>
      </Container>
      <Container
        maxWidth={CardGrid}
        paddingX={space['1.5']}
        marginBottom={space['1.5']}
        alignItems="stretch">
        <CTACard
          variant="dark"
          title="Gruppen-Lernunterstützung"
          content="Kurzfristige Unterstützung bei spezifischen Problemen und Fragen"
          icon={<LFIconBook />}
          button={<Button>{t('matching.blocker.ctaCardButton')}</Button>}
        />
      </Container>
    </>
  )
}
export default MatchingBlocker
