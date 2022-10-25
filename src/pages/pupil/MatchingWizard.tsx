import { gql, useMutation, useQuery } from '@apollo/client'
import { Text, VStack, Heading, TextArea, Button, useTheme } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useModal from '../../hooks/useModal'
import de from '../../lang/de'
import { LFSubject } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'

type Props = {}

const MatchingWizard: React.FC<Props> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setShow, setContent } = useModal()

  const [selection, setSelection] = useState<LFSubject>()

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
            mandatory
          }
        }
      }
    }
  `)

  const [
    createMatchRequest,
    { data: requestData, error: requestError, loading: requestLoading }
  ] = useMutation(gql`
    mutation createMatchRequest($subjects: [SubjectInput!]) {
      pupilUpdate(data: { subjects: $subjects })
      pupilCreateMatchRequest
    }
  `)

  const onRequestMatch = useCallback(() => {
    const subjects = [...data?.me?.pupil?.subjectsFormatted]
    const find = selection && subjects.find(sub => sub.name === selection.name)
    if (find) {
      find.mandatory = true
    }
    const subs = []

    for (const sub of subjects) {
      delete sub.__typename
      subs.push(sub)
    }

    createMatchRequest({ variables: { subjects: subs } })
  }, [createMatchRequest, data?.me?.pupil?.subjectsFormatted, selection])

  useEffect(() => {
    if (requestData && !requestError) {
      setContent(
        <>
          <Heading>Deine Anfrage wurde erstellt!</Heading>
          <Button
            onPress={() => {
              setShow(false)
            }}>
            Weiter
          </Button>
        </>
      )
      setShow(true)
    }
  }, [requestData, requestError, setContent, setShow])

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
          {data?.me?.pupil?.subjectsFormatted.map((sub: LFSubject) => (
            <IconTagList
              initial={selection?.name === sub.name}
              text={sub.name}
              variant="selection"
              iconPath={`languages/icon_${sub.name.toLowerCase()}.svg`}
              onPress={() => setSelection(sub)}
            />
          ))}
        </TwoColGrid>
      </VStack>

      <Button
        onPress={onRequestMatch}
        isDisabled={requestData || !data?.me?.pupil?.canRequestMatch?.allowed}>
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
