import { gql, useMutation, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'

import {
  Text,
  VStack,
  Heading,
  Button,
  useTheme,
  Modal,
  useBreakpointValue,
  Row
} from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner'
import useModal from '../../hooks/useModal'
import { getSubjectKey, LFSubject } from '../../types/lernfair/Subject'
import IconTagList from '../../widgets/IconTagList'
import TwoColGrid from '../../widgets/TwoColGrid'

type Props = {}

const MatchingWizard: React.FC<Props> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setShow, setContent } = useModal()

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [selection, setSelection] = useState<LFSubject>()

  const { space, sizes } = useTheme()

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Matching – anfordern'
    })
  }, [])

  const { data, loading } = useQuery(gql`
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
    let find = selection && subjects.find(sub => sub.name === selection.name)

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
      setShowSuccessModal(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestData, requestError, setContent, setShow])

  const ContentContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['contentContainerWidth']
  })

  const ContainerWidth = useBreakpointValue({
    base: '100%',
    lg: sizes['containerWidth']
  })

  const MatchingButton = useBreakpointValue({
    base: 'column',
    lg: 'row'
  })

  const MatchingButtonSpacing = useBreakpointValue({
    base: space['1'],
    lg: 0
  })

  const SelectedSchoolType = data?.me?.pupil?.schooltype

  if (loading) return <CenterLoadingSpinner />

  return (
    <>
      <VStack
        space={space['1']}
        paddingX={space['1']}
        width="100%"
        marginX="auto"
        maxWidth={ContainerWidth}>
        <Heading>{t('matching.request.headline')}</Heading>
        <Text maxWidth={ContentContainerWidth}>
          {t('matching.request.content')}
        </Text>
        <Heading fontSize="lg">{t('matching.request.yourDetails')}</Heading>

        <VStack space={space['0.5']} maxWidth={ContentContainerWidth}>
          <Text>
            <Text bold>{t('matching.request.schoolType')}</Text>{' '}
            <Text>
              {SelectedSchoolType === 'other'
                ? 'Andere'
                : SelectedSchoolType === 'grundschule'
                ? 'Grundschule'
                : SelectedSchoolType === 'gesamtschule'
                ? 'Gesamtschule'
                : SelectedSchoolType === 'hauptschule'
                ? 'Hauptschule'
                : SelectedSchoolType === 'realschule'
                ? 'Realschule'
                : SelectedSchoolType === 'gymnasium'
                ? 'Gymnasium'
                : SelectedSchoolType === 'f_rderschule'
                ? 'Förderschule'
                : SelectedSchoolType === 'berufsschule'
                ? 'Berufsschule'
                : SelectedSchoolType}
            </Text>
          </Text>
          <Text>
            <Text bold>{t('matching.request.grade')}</Text>{' '}
            {data?.me?.pupil?.gradeAsInt}
          </Text>
        </VStack>
        <VStack space={space['0.5']} maxWidth={ContentContainerWidth}>
          <Text bold>{t('matching.request.needHelpInHeadline')}</Text>
          <Text>{t('matching.request.needHelpInContent')}</Text>
          <TwoColGrid>
            {data?.me?.pupil?.subjectsFormatted.map((sub: LFSubject) => (
              <IconTagList
                initial={selection?.name === sub.name}
                text={sub.name}
                variant="selection"
                iconPath={`subjects/icon_${getSubjectKey(sub.name)}.svg`}
                onPress={() => setSelection(sub)}
              />
            ))}
          </TwoColGrid>
        </VStack>

        <Row
          flexDirection={MatchingButton}
          space={space['1']}
          marginBottom={space['1.5']}>
          <Button
            marginBottom={MatchingButtonSpacing}
            onPress={onRequestMatch}
            isDisabled={
              requestData || !data?.me?.pupil?.canRequestMatch?.allowed
            }>
            {t('matching.request.buttons.request')}
          </Button>

          {!data?.me?.pupil?.canRequestMatch?.allowed && (
            <Text>
              {t(
                `lernfair.reason.${data?.me?.pupil?.canRequestMatch?.reason}.matching`
              )}
            </Text>
          )}
          <Button
            variant={'outline'}
            onPress={() => {
              trackEvent({
                category: 'matching',
                action: 'click-event',
                name: 'Schüler Matching anfragen – Abbrechen',
                documentTitle: 'Schüler Matching Anfragen'
              })
              navigate(-1)
            }}>
            {t('matching.request.buttons.cancel')}
          </Button>
        </Row>
      </VStack>
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          navigate('/start')
        }}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Anfrage erstellt</Modal.Header>
          <Modal.Body>Deine Anfrage wurde erfolgreich erstellt!</Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                setShowSuccessModal(false)
                navigate('/start')
              }}>
              Weiter
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default MatchingWizard
