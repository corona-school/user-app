import {
  Text,
  VStack,
  Box,
  Button,
  useTheme,
  useBreakpointValue,
  Heading,
  Image,
  Alert,
  HStack,
  AspectRatio
} from 'native-base'
import { useTranslation } from 'react-i18next'
import CTACard from '../../widgets/CTACard'

import Icon from '../../assets/icons/lernfair/lf-books.svg'
import { useNavigate } from 'react-router-dom'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import AlertMessage from '../../widgets/AlertMessage'

type Props = {
  onRequestMatch: () => any
}

const MatchingOnboarding: React.FC<Props> = ({ onRequestMatch }) => {
  const { data, error, loading } = useQuery(gql`
    query {
      me {
        pupil {
          id
          canRequestMatch {
            allowed
            reason
            limit
          }
          schooltype
          gradeAsInt
          subjectsFormatted {
            name
            mandatory
          }
        }
      }
    }
  `)

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

  const ImageHeader = useBreakpointValue({
    base: '20px',
    lg: '500px'
  })

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Matching'
    })
  }, [])

  return (
    <VStack
      space={space['0.5']}
      paddingX={space['1']}
      width="100%"
      marginX="auto"
      maxWidth={ContainerWidth}>
      <Heading paddingBottom={space['0.5']}>
        {t('matching.blocker.title')}
      </Heading>
      <AspectRatio
        ratio={{
          base: 4 / 3,
          md: 16 / 6
        }}
        height={{
          base: 1,
          md: 1
        }}>
        <Image
          borderRadius="10px"
          marginBottom={space['1']}
          resizeMode="cover"
          source={{
            uri: require('../../assets/images/matching/1-1-matching.jpg')
          }}
        />
      </AspectRatio>
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

      <VStack marginBottom={space['1.5']}>
        <Button
          isDisabled={!data?.me?.pupil?.canRequestMatch?.allowed}
          width={ButtonContainer}
          variant="outline"
          onPress={onRequestMatch}>
          {t('matching.blocker.button')}
        </Button>
        {!data?.me?.pupil?.canRequestMatch?.allowed && (
          <AlertMessage
            content={t(
              `lernfair.reason.${data?.me?.pupil?.canRequestMatch?.reason}.matching`
            )}
          />
        )}
      </VStack>
      <Box paddingBottom={space['3']}>
        <CTACard
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
