import {
  Text,
  VStack,
  Button,
  useTheme,
  useBreakpointValue,
  Heading
} from 'native-base'
import { useTranslation } from 'react-i18next'

import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import AlertMessage from '../../widgets/AlertMessage'

type Props = {
  onRequestMatch: () => any
}

const MatchingOnboarding: React.FC<Props> = ({ onRequestMatch }) => {
  const { data } = useQuery(gql`
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

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Matching'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <VStack
      space={space['0.5']}
      paddingX={space['1']}
      width="100%"
      marginX="auto"
      maxWidth={ContainerWidth}>
      <Heading paddingBottom={space['0.5']}>
        {t('matching.request.check.title')}
      </Heading>
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
          onPress={onRequestMatch}>
          Match anfordern
        </Button>
        {!data?.me?.pupil?.canRequestMatch?.allowed && (
          <AlertMessage
            content={t(
              `lernfair.reason.${data?.me?.pupil?.canRequestMatch?.reason}.matching`
            )}
          />
        )}
      </VStack>
    </VStack>
  )
}
export default MatchingOnboarding
