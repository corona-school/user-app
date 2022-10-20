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
  WarningIcon
} from 'native-base'
import WithNavigation from '../../components/WithNavigation'
import BackButton from '../../components/BackButton'
import CTACard from '../../widgets/CTACard'
import LFIconBook from '../../assets/icons/lernfair/lf-books.svg'
import LFImageLearing from '../../assets/images/matching/1-1-matching.jpg'
import LFParty from '../../assets/icons/lernfair/lf-party.svg'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-dom'

type Props = {}

const MatchingBlocker: React.FC<Props> = () => {
  const { space } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cancelModal, setCancelModal] = useState<boolean>(false)

  return (
    <>
      <Container
        maxWidth="100%"
        paddingX={space['1.5']}
        alignItems="stretch"
        marginBottom={space['0.5']}>
        <Heading paddingTop="64px" marginBottom={space['1']}>
          {t('matching.blocker.title')}
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
        <Button marginBottom={space['1.5']} variant="outline">
          {t('matching.blocker.button')}
        </Button>
      </Container>
      <Container
        maxWidth="100%"
        paddingX={space['1.5']}
        marginBottom={space['1.5']}
        alignItems="stretch">
        <CTACard
          width="100%"
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
