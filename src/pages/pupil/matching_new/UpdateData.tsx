import { FetchResult, gql, useMutation } from '@apollo/client'
import { DocumentNode, GraphQLError } from 'graphql'
import {
  Text,
  VStack,
  useTheme,
  Heading,
  Row,
  Column,
  Modal,
  Button,
  useToast
} from 'native-base'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CSSWrapper from '../../../components/CSSWrapper'
import { schooltypes } from '../../../types/lernfair/SchoolType'
import { states } from '../../../types/lernfair/State'
import IconTagList from '../../../widgets/IconTagList'
import ProfileSettingItem from '../../../widgets/ProfileSettingItem'
import { RequestMatchContext } from './Matching'

type Props = {
  schooltype: string
  gradeAsInt: number
  state: string
  refetchQuery: DocumentNode
}

const UpdateData: React.FC<Props> = ({
  schooltype,
  gradeAsInt,
  state,
  refetchQuery
}) => {
  const { setCurrentIndex } = useContext(RequestMatchContext)
  const { space } = useTheme()
  const { t } = useTranslation()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [showModal, setShowModal] = useState<boolean>()
  const [modalType, setModalType] = useState<
    'schooltype' | 'schoolclass' | 'state'
  >()
  const [modalSelection, setModalSelection] = useState<string>()

  const [meUpdateSchooltype] = useMutation(
    gql`
      mutation changeSchooltypeData($data: SchoolType!) {
        meUpdate(update: { pupil: { schooltype: $data } })
      }
    `,
    { refetchQueries: [refetchQuery] }
  )
  const [meUpdateSchoolClass] = useMutation(
    gql`
      mutation changeSchoolClassData($data: Int!) {
        meUpdate(update: { pupil: { gradeAsInt: $data } })
      }
    `,
    { refetchQueries: [refetchQuery] }
  )
  const [meUpdateState] = useMutation(
    gql`
      mutation changeStateData($data: State!) {
        meUpdate(update: { pupil: { state: $data } })
      }
    `,
    { refetchQueries: [refetchQuery] }
  )

  const listItems = useMemo(() => {
    switch (modalType) {
      case 'schooltype':
        return schooltypes
      case 'schoolclass':
        return Array.from({ length: 13 }, (_, i) => ({
          label: `${i + 1}. Klasse`,
          key: `${i + 1}`
        }))
      case 'state':
        return states
      default:
        return []
    }
  }, [modalType])

  const data = useMemo(() => {
    switch (modalType) {
      case 'schooltype':
        return schooltype

      case 'schoolclass':
        return `${gradeAsInt}`
      case 'state':
        return state
      default:
        return schooltype
    }
  }, [modalType, gradeAsInt, schooltype, state])

  useEffect(() => {
    setModalSelection(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType])

  const changeData = useCallback(async () => {
    if (!modalSelection) return
    setIsLoading(true)
    try {
      switch (modalType) {
        case 'schooltype':
          await meUpdateSchooltype({
            variables: { data: modalSelection }
          })
          break
        case 'schoolclass':
          await meUpdateSchoolClass({
            variables: { data: parseInt(modalSelection) }
          })
          break
        case 'state':
          await meUpdateState({ variables: { data: modalSelection } })
          break
        default:
          break
      }
      toast.show({ description: t('Daten geupdatet') })
    } catch (e) {
      toast.show({ description: t('error') })
    }
    setShowModal(false)
    setIsLoading(false)
  }, [
    meUpdateSchoolClass,
    meUpdateSchooltype,
    meUpdateState,
    modalSelection,
    modalType,
    t,
    toast
  ])

  return (
    <>
      <VStack space={space['0.5']}>
        <Heading fontSize="2xl">Profil aktualisieren</Heading>
        <Text>
          Damit wir dir eine:n optimale:n Lernpartner:in zuteilen können, bitten
          wir dich deine persönlichen Informationen noch einmal zu überprüfen
          und zu vervollständigen.
        </Text>
        <Heading>Persönliche Daten</Heading>

        <ProfileSettingItem
          title={t('profile.SchoolType.label')}
          href={() => {
            setModalType('schooltype')
            setShowModal(true)
          }}>
          <Row flexWrap="wrap" w="100%">
            {(schooltype && (
              <Column marginRight={3} mb={space['0.5']}>
                <CSSWrapper className="profil-tab-link">
                  <IconTagList
                    isDisabled
                    iconPath={`schooltypes/icon_${schooltype}.svg`}
                    text={t(`lernfair.schooltypes.${schooltype}`)}
                  />
                </CSSWrapper>
              </Column>
            )) || <Text>{t('profile.Notice.noSchoolType')}</Text>}
          </Row>
        </ProfileSettingItem>
        <ProfileSettingItem
          title={t('profile.SchoolClass.label')}
          href={() => {
            setModalType('schoolclass')
            setShowModal(true)
          }}>
          <Row flexWrap="wrap" w="100%">
            {(gradeAsInt && (
              <Column marginRight={3} mb={space['0.5']}>
                <CSSWrapper className="profil-tab-link">
                  <IconTagList
                    isDisabled
                    textIcon={`${gradeAsInt}`}
                    text={t('lernfair.schoolclass', {
                      class: gradeAsInt
                    })}
                  />
                </CSSWrapper>
              </Column>
            )) || <Text>{t('profile.Notice.noSchoolGrade')}</Text>}
          </Row>
        </ProfileSettingItem>

        <ProfileSettingItem
          title={t('profile.State.label')}
          href={() => {
            setModalType('state')
            setShowModal(true)
          }}>
          <Row flexWrap="wrap" w="100%">
            {(state && (
              <Column marginRight={3} mb={space['0.5']}>
                {(state && (
                  <CSSWrapper className="profil-tab-link">
                    <IconTagList
                      isDisabled
                      iconPath={`states/icon_${state}.svg`}
                      text={t(`lernfair.states.${state}`)}
                    />
                  </CSSWrapper>
                )) || <Text>{t('profile.noInfo')}</Text>}
              </Column>
            )) || <Text>{t('profile.Notice.noState')}</Text>}
          </Row>
        </ProfileSettingItem>

        <Button onPress={() => setCurrentIndex(3)} isDisabled={isLoading}>
          Weiter
        </Button>
      </VStack>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setModalSelection('')
        }}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Ändern</Modal.Header>
          <Modal.Body>
            <Row flexWrap="wrap">
              {listItems.map((item: { label: string; key: string }) => (
                <IconTagList
                  initial={modalSelection === item.key}
                  text={item.label}
                  onPress={() => setModalSelection(item.key)}
                />
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              isDisabled={data === modalSelection || isLoading}
              onPress={changeData}>
              Ändern
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
export default UpdateData
