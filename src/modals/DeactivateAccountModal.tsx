import { gql, useMutation } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import {
  Text,
  VStack,
  useTheme,
  useToast,
  Radio,
  Button,
  TextArea,
  Modal
} from 'native-base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useApollo from '../hooks/useApollo'
import useLernfair from '../hooks/useLernfair'

// corresponding dissolve reason ids in translation file
// for now just loop through 0-5 and 0-6 (+1 in loop)
const pupilReasons = new Array(6).fill(0)
const studentReasons = new Array(7).fill(0)

type Props = {
  isOpen?: boolean
  onCloseModal?: () => any
}

const DeactivateAccountModal: React.FC<Props> = ({ isOpen, onCloseModal }) => {
  const [reason, setReason] = useState<string>()
  const [other, setOther] = useState<string>('')
  const { space } = useTheme()
  const navigate = useNavigate()
  const { trackEvent } = useMatomo()
  const { logout } = useApollo()
  const { t } = useTranslation()

  const { userType } = useLernfair()
  const toast = useToast()

  const [deactivateAccount, { loading: loadingDeactivate }] = useMutation(gql`
    mutation deactiveAccount($reason: String) {
      meDeactivate(reason: $reason)
    }
  `)

  const desc = useMemo(
    () =>
      userType === 'student'
        ? t('profile.Deactivate.modal.description.student')
        : t('profile.Deactivate.modal.description.pupil'),
    [t, userType]
  )

  const reasons = useMemo(
    () => (userType === 'student' ? studentReasons : pupilReasons),
    [userType]
  )

  const isOther = useMemo(
    () => reason === `${reasons.length}`,
    [reason, reasons.length]
  )

  useEffect(() => {
    !isOther && setOther('')
  }, [isOther, reason, reasons.length])

  const showError = useCallback(() => {
    toast.show({
      description: t('profile.Deactivate.error')
    })
  }, [t, toast])

  const deactivate = useCallback(async () => {
    if (reason === undefined) return
    try {
      const res = await deactivateAccount({
        variables: {
          reason: !isOther
            ? `${t(`profile.Deactivate.${userType}.${parseInt(reason)}`)}`
            : other
        }
      })

      onCloseModal && onCloseModal()
      if (res.data.meDeactivate) {
        trackEvent({
          category: 'profil',
          action: 'click-event',
          name: 'Account deaktivieren',
          documentTitle: 'Deactivate'
        })
        logout()
        navigate('/welcome', { state: { deactivated: true } })
      } else {
        showError()
      }
    } catch (e) {
      showError()
    }
  }, [
    reason,
    deactivateAccount,
    isOther,
    t,
    userType,
    other,
    onCloseModal,
    trackEvent,
    logout,
    navigate,
    toast
  ])

  const isValidInput = useMemo(() => {
    if (!reason) return false

    if (reason === `${reasons.length}`) {
      return other.length > 0
    } else {
      return true
    }
  }, [other.length, reason, reasons.length])

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{t('profile.Deactivate.modal.title')}</Modal.Header>
        <Modal.Body>
          <VStack space={space['1']}>
            <Text>{desc}</Text>
            <Radio.Group name="reasons" onChange={setReason}>
              <VStack space={space['0.5']}>
                {reasons.map((_, index: number) => (
                  <Radio value={`${index + 1}`}>
                    {t(`profile.Deactivate.${userType}.${index + 1}`)}
                  </Radio>
                ))}
              </VStack>
            </Radio.Group>

            {isOther && (
              <TextArea
                value={other}
                onChangeText={setOther}
                autoCompleteType={'normal'}
                placeholder={t('profile.Deactivate.modal.other.placeholder')}
              />
            )}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button
            isDisabled={!isValidInput || loadingDeactivate}
            onPress={deactivate}>
            {t('profile.Deactivate.modal.btn')}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
export default DeactivateAccountModal
