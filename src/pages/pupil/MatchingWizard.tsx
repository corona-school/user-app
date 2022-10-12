import { gql, useMutation, useQuery } from '@apollo/client'
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
          }
        }
      }
    }
  `)

  const [
    createMatchRequest,
    { data: requestData, error: requestError, loading: requestLoading }
  ] = useMutation(gql`
    mutation createMatchRequest($pupilId: Float!) {
      pupilCreateMatchRequest(pupilId: $pupilId)
    }
  `)

  const onRequestMatch = useCallback(() => {
    createMatchRequest({
      variables: {
        pupilId: data?.me?.pupil?.id
      }
    })
  }, [createMatchRequest, data?.me?.pupil?.id])

  if (loading) return <></>

  return (
    <VStack space={space['1']} paddingX={space['1']}>
      <Heading>{t('matching.request.headline')}</Heading>
      <Text>{t('matching.request.content')}</Text>
      <Heading fontSize="lg">{t('matching.request.yourDetails')}</Heading>

      <VStack space={space['0.5']}>
        <Text>
          <Text bold>{t('matching.request.schoolType')}</Text>{' '}
          {data?.me?.pupil?.schooltype}
        </Text>
        <Text>
          <Text bold>{t('matching.request.grade')}</Text>{' '}
          {data?.me?.pupil?.gradeAsInt}
        </Text>
      </VStack>
      <VStack space={space['0.5']}>
        <Text bold>{t('matching.request.needHelpInHeadline')}</Text>
        <Text>{t('matching.request.needHelpInContent')}</Text>
        <TwoColGrid>
          {subs.map((sub: any) => (
            <IconTagList text={sub.name} variant="selection" />
          ))}
        </TwoColGrid>
      </VStack>
      <Text bold>{t('matching.request.describ')}</Text>
      <TextArea autoCompleteType={{}} />
      <Button
        onPress={onRequestMatch}
        isDisabled={!data?.me?.pupil?.canRequestMatch?.allowed}>
        {t('matching.request.buttons.request')}
      </Button>

      {!data?.me?.pupil?.canRequestMatch?.allowed && (
        <Text>{data?.me?.pupil?.canRequestMatch?.reason}</Text>
      )}
      <Button variant={'outline'} onPress={() => navigate(-1)}>
        {t('matching.request.buttons.cancel')}
      </Button>
    </VStack>
  )
}
export default MatchingWizard
