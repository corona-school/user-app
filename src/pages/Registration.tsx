import {
  Text,
  VStack,
  Input,
  Heading,
  Checkbox,
  Button,
  useTheme
} from 'native-base'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ToggleButton from '../components/ToggleButton'
import { ModalContext } from '../widgets/FullPageModal'

type Props = {}

const Registration: React.FC<Props> = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [legalChecked, setLegalChecked] = useState<boolean>()
  const [typeSelection, setTypeSelection] = useState<string>()

  const { space } = useTheme()
  const { t } = useTranslation()
  const { setContent, setShow, setVariant } = useContext(ModalContext)

  const showModal = () => {
    setVariant('dark')
    setContent(
      <VStack>
        <Heading color={'lightText'}>{t('registration.barrier.title')}</Heading>
        <Text color={'lightText'}>{t(`registration.barrier.text`)}</Text>
        {new Array(10).fill(0).map((_, i) => (
          <Text color={'lightText'}>
            {t(`registration.barrier.point_${i}`)}
          </Text>
        ))}
      </VStack>
    )
    setShow(true)
  }

  return (
    <>
      <VStack flex="1" paddingX={space['0.5']}>
        <VStack space={space['0.5']}>
          <Input placeholder={t('registration.email')} />
          <Input placeholder={t('registration.password')} />
          <Input placeholder={t('registration.password_repeat')} />
        </VStack>
        <VStack space={space['0.5']} marginTop={space['1']}>
          <Heading>{t('registration.i_am')}</Heading>
          <ToggleButton
            label={t('registration.parent')}
            dataKey="parent"
            isActive={typeSelection === 'parent'}
            onPress={setTypeSelection}
          />
          <ToggleButton
            label={t('registration.student')}
            dataKey="student"
            isActive={typeSelection === 'student'}
            onPress={setTypeSelection}
          />
          <ToggleButton
            label={t('registration.tutor')}
            dataKey="tutor"
            isActive={typeSelection === 'tutor'}
            onPress={setTypeSelection}
          />
        </VStack>
        <VStack space={space['1']} marginTop={space['1']}>
          <Checkbox value={'legalChecked'} onChange={setLegalChecked}>
            {t('registration.check_legal')}
          </Checkbox>
          <Button
            onPress={() => showModal()}
            isDisabled={!legalChecked || !typeSelection}>
            {t('registration.btn.next')}
          </Button>
        </VStack>
      </VStack>
    </>
  )
}
export default Registration
