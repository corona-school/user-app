import {
  Text,
  VStack,
  Input,
  Heading,
  Checkbox,
  Button,
  useTheme,
  Row,
  TextArea
} from 'native-base'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ToggleButton from '../../components/ToggleButton'
import { ModalContext } from '../../widgets/FullPageModal'

type Props = {}

const RegistrationPersonal: React.FC<Props> = () => {
  const { t } = useTranslation()
  const { space } = useTheme()
  const navigate = useNavigate()

  return (
    <div>
      <VStack space={space['1']}>
        <Input placeholder={t('firstname')} />
        <Input placeholder={t('lastname')} />
        <>
          <Heading>Über mich</Heading>
          <TextArea
            h={150}
            placeholder={t(
              'Schreib hier einen kurzen Text zu dir, den andere Nutzer:innen auf deinem Profil sehen können.'
            )}
            autoCompleteType={{}}
          />
        </>
        <Button onPress={() => navigate('/registration/3')}>
          Registrieren
        </Button>
      </VStack>
    </div>
  )
}
export default RegistrationPersonal
