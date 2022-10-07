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
      <WithNavigation
        headerTitle={t('matching.blocker.header')}
        headerLeft={<BackButton />}>
        <Container
          maxWidth="100%"
          paddingX={space['1.5']}
          alignItems="stretch"
          marginBottom={space['0.5']}>
          <Heading marginBottom={space['1']}>
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
          <Button
            onPress={() => setCancelModal(true)}
            marginBottom={space['1.5']}
            variant="outline">
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
            title={t('matching.blocker.ctaCardHeader')}
            content={t('matching.blocker.ctaCardContent')}
            icon={<LFIconBook />}
            button={<Button>{t('matching.blocker.ctaCardButton')}</Button>}
          />
        </Container>
      </WithNavigation>
      <Modal
        bg="modalbg"
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}>
        <Modal.Content
          width="367px"
          marginX="auto"
          backgroundColor="transparent">
          <Box position="absolute" zIndex="1" right="20px" top="14px">
            <Pressable onPress={() => setCancelModal(false)}>
              <CloseIcon color="white" />
            </Pressable>
          </Box>
          <Modal.Body background="primary.900" padding={space['1']}>
            <Box alignItems="center" marginY={space['1']}>
              <LFParty />
            </Box>
            <Box paddingY={space['1']}>
              <Heading
                maxWidth="350px"
                marginX="auto"
                fontSize="md"
                textAlign="center"
                color="lightText"
                marginBottom={space['0.5']}>
                {t('matching.blocker.modal.title')}
              </Heading>
              <Text
                textAlign="center"
                color="lightText"
                maxWidth="330px"
                marginBottom={space['1']}
                marginX="auto">
                {t('matching.blocker.modal.content')}
              </Text>
              <Heading
                textAlign="center"
                fontSize="sm"
                color="lightText"
                maxWidth="330px"
                marginBottom="5px"
                marginX="auto">
                {t('matching.blocker.modal.contentHeadline')}
              </Heading>
              <Text
                textAlign="center"
                fontSize="sm"
                color="lightText"
                maxWidth="330px"
                marginX="auto">
                {t('matching.blocker.modal.contentPreContent')}{' '}
                <Text bold> {t('matching.blocker.modal.contentBold')}</Text>{' '}
                {t('matching.blocker.modal.contentEndContent')}
              </Text>
            </Box>
            <Box paddingY={space['1']}>
              <Row marginBottom={space['0.5']}>
                <Button onPress={() => navigate('/matching')} width="100%">
                  {t('matching.blocker.modal.buttons.button1')}
                </Button>
              </Row>
              <Row>
                <Button
                  onPress={() => cancelModal}
                  width="100%"
                  variant="outlinelight">
                  {t('matching.blocker.modal.buttons.button2')}
                </Button>
              </Row>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default MatchingBlocker
