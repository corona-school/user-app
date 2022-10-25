import {
  Text,
  Heading,
  useTheme,
  VStack,
  Input,
  useBreakpointValue,
  Column,
  Row,
  Button,
  Spinner,
  Box
} from 'native-base'

import { useTranslation } from 'react-i18next'
import WithNavigation from '../components/WithNavigation'
import NotificationAlert from '../components/NotificationAlert'
import { gql, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LFMatch } from '../types/lernfair/Match'
import TeacherCard from '../widgets/TeacherCard'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

type Props = {}

const pupilQuery = gql`
  query {
    me {
      pupil {
        matches {
          dissolved
          student {
            firstname
            lastname
          }
        }
      }
    }
  }
`

const LearningPartnerArchive: React.FC<Props> = () => {
  const { space, sizes } = useTheme()
  const navigate = useNavigate()

  const { t } = useTranslation()

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  // const ButtonContainer = useBreakpointValue({
  //   base: '100%',
  //   lg: sizes['desktopbuttonWidth']
  // })

  const CardGrid = useBreakpointValue({
    base: '100%',
    lg: '47%'
  })

  const [searchString, setSearchString] = useState<string>('')

  const { loading, data } = useQuery(pupilQuery)

  const activeMatches = useMemo(
    () => data?.me?.pupil?.matches.map((match: LFMatch) => !match.dissolved),
    [data?.me?.pupil?.matches]
  )

  const searchResults = useMemo(() => {
    return (
      activeMatches?.filter((match: LFMatch) =>
        match.student.firstname
          .toLowerCase()
          .includes(
            searchString.toLowerCase() ||
              match.student.lastname
                .toLowerCase()
                .includes(searchString.toLowerCase())
          )
      ) || []
    )
  }, [activeMatches, searchString])

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Lernpartner Archive'
    })
  }, [])

  return (
    <WithNavigation
      headerTitle={t('archive.learningpartner.header')}
      headerLeft={<NotificationAlert />}>
      <VStack paddingX={space['1']} width={ContainerWidth}>
        <VStack space={space['1']}>
          <VStack space={space['0.5']}>
            <Heading>{t('archive.learningpartner.title')}</Heading>
            <Text>{t('archive.learningpartner.content')}</Text>
          </VStack>
          <Row paddingY={space['1']}>
            <Input
              flex="1"
              size="lg"
              placeholder={t('matching.group.helper.support.search')}
              onChangeText={setSearchString}
            />
          </Row>
          <VStack space={space['1']}>
            <Heading>{t('archive.learningpartner.sectionHeadline')}</Heading>
            <Text>{t('archive.learningpartner.sectionContent')}</Text>
          </VStack>
          <VStack flex="1">
            {loading && (
              <Box mt="5">
                <Spinner />
              </Box>
            )}
            {!loading && (
              <>
                {(searchResults.length && (
                  <VStack>
                    {searchResults.map((match: LFMatch, index: number) => {
                      return (
                        <Column width={CardGrid} marginRight="15px" key={index}>
                          <TeacherCard
                            name={`${match.student?.firstname} ${match.student?.lastname}`}
                            variant="dark"
                            tags={match.subjectsFormatted?.map(s => s.name)}
                            button={
                              <Button variant="outlinelight">
                                {t('dashboard.offers.match')}
                              </Button>
                            }
                          />
                        </Column>
                      )
                    })}
                  </VStack>
                )) || <Text>Es wurden keine Ergebnisse gefunden.</Text>}
              </>
            )}
          </VStack>
        </VStack>
      </VStack>
    </WithNavigation>
  )
}
export default LearningPartnerArchive
