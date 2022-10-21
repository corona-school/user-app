import {
  Text,
  VStack,
  Box,
  Button,
  useTheme,
  useBreakpointValue,
  Heading,
  Image
} from 'native-base'
import { useTranslation } from 'react-i18next'
import CTACard from '../../widgets/CTACard'

import Icon from '../../assets/icons/lernfair/lf-books.svg'
import { Navigate, useNavigate } from 'react-router-dom'

type Props = {
  onRequestMatch: () => any
}

const MatchingOnboarding: React.FC<Props> = ({ onRequestMatch }) => {
  const { t } = useTranslation()
  const { space, sizes } = useTheme()
  const navigate = useNavigate()

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const ButtonContainer = useBreakpointValue({
    base: '100%',
    lg: sizes['desktopbuttonWidth']
  })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '48%'
  })

  return (
    <VStack space={space['0.5']} paddingX={space['1']} width={ContainerWidth}>
      <Heading paddingBottom={space['0.5']}>
        {t('matching.blocker.title')}
      </Heading>
      <Image
        width="100%"
        height="300px"
        borderRadius="10px"
        marginBottom={space['1']}
        source={{
          uri: require('../../assets/images/matching/1-1-matching.jpg')
        }}
      />
      <Text maxWidth={ContentContainerWidth} paddingBottom={space['0.5']}>
        {t('matching.blocker.firstContent')}
      </Text>
      <Text maxWidth={ContentContainerWidth} bold>
        {t('matching.blocker.headlineContent')}
      </Text>
      <Text maxWidth={ContentContainerWidth} paddingBottom={space['1']}>
        {t('matching.blocker.contentBox1')}{' '}
        <Text bold> {t('matching.blocker.contentBox2') + ' '}</Text>
        {t('matching.blocker.contentBox3')}
      </Text>
      <Button
        width={ButtonContainer}
        variant="outline"
        onPress={onRequestMatch}
        marginBottom={space['1.5']}>
        {t('matching.blocker.button')}
      </Button>
      <Box width={CardGrid}>
        <CTACard
          width={ContentContainerWidth}
          variant="dark"
          icon={<Icon />}
          title={t('matching.blocker.ctaCardHeader')}
          content={<Text>{t('matching.blocker.ctaCardContent')}</Text>}
          button={
            <Button onPress={() => navigate('/group')}>
              {t('matching.blocker.ctaCardButton')}
            </Button>
          }
        />
      </Box>
    </VStack>
  )
}
export default MatchingOnboarding
