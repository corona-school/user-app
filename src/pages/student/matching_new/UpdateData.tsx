import { gql, useMutation } from '@apollo/client'
import { DocumentNode } from 'graphql'
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
import { states } from '../../../types/lernfair/State'
import IconTagList from '../../../widgets/IconTagList'
import ProfileSettingItem from '../../../widgets/ProfileSettingItem'
import { RequestMatchContext } from './RequestMatch'

type Props = {
  state: string
  refetchQuery: DocumentNode
}

const UpdateData: React.FC<Props> = ({ state, refetchQuery }) => {
  const { setCurrentIndex } = useContext(RequestMatchContext)
  const { space } = useTheme()
  const { t } = useTranslation()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [showModal, setShowModal] = useState<boolean>()
  const [modalType, setModalType] = useState<'state'>()
  const [modalSelection, setModalSelection] = useState<string>()

  const [meUpdateState] = useMutation(
    gql`
      mutation changeStudentStateData($data: StudentState!) {
        meUpdate(update: { student: { state: $data } })
      }
    `,
    { refetchQueries: [refetchQuery] }
  )

  const listItems = useMemo(() => {
    switch (modalType) {
      case 'state':
        return states
      default:
        return []
    }
  }, [modalType])

  const data = useMemo(() => {
    switch (modalType) {
      case 'state':
        return state
    }
  }, [modalType, state])

  useEffect(() => {
    setModalSelection(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType])

  const changeData = useCallback(async () => {
    if (!modalSelection) return
    setIsLoading(true)
    try {
      switch (modalType) {
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
  }, [meUpdateState, modalSelection, modalType, t, toast])

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

        {/*                      1 = subjects */}
        <Button onPress={() => setCurrentIndex(1)} isDisabled={isLoading}>
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
