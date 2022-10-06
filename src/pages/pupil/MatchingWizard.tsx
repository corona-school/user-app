import { gql, useQuery } from '@apollo/client'
import { Text, VStack, Heading, TextArea, Button, useTheme } from 'native-base'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LFSubject } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'

type Props = {}

const subs: LFSubject[] = [
  { name: 'Englisch', grade: { min: 1, max: 11 }, mandatory: false },
  { name: 'Informatik', grade: { min: 1, max: 11 }, mandatory: false }
]

const MatchingWizard: React.FC<Props> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { space } = useTheme()
  const { data, error, loading } = useQuery(gql`
    query {
      me {
        pupil {
          schooltype
          gradeAsInt
          subjectsFormatted {
            name
          }
        }
      }
    }
  `)

  const onRequestMatch = useCallback(() => {}, [])

  return (
    <VStack space={space['1']} paddingX={space['1']}>
      <Heading>{t('matching.request.headline')}</Heading>
      <Text>{t('matching.request.content')}</Text>
      <Text bold>{t('matching.request.yourDetails')}</Text>

      <Text>
        <Text bold>{t('matching.request.schoolType')}</Text>{' '}
        {data?.me?.pupil?.schooltype}
      </Text>
      <Text>
        <Text bold>{t('matching.request.grade')}</Text>{' '}
        {data?.me?.pupil?.gradeAsInt}
      </Text>
      <Text bold>{t('matching.request.needHelpInHeadline')}</Text>
      <Text>{t('matching.request.needHelpInContent')}</Text>
      <TwoColGrid>
        {subs.map((sub: any) => (
          <IconTagList text={sub.name} variant="selection" />
        ))}
      </TwoColGrid>
      <Text bold>{t('matching.request.describ')}</Text>
      <TextArea autoCompleteType={{}} />
      <Button onPress={onRequestMatch}>
        {t('matching.request.buttons.request')}
      </Button>
      <Button variant={'outline'} onPress={() => navigate(-1)}>
        {t('matching.request.buttons.cancel')}
      </Button>
    </VStack>
  )
}
export default MatchingWizard
