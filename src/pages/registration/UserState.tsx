import { Button, Column, Heading, Row, useTheme, VStack } from 'native-base'
import { useContext } from 'react'
import { RegistrationContext } from '../Registration'
import IconTagList from '../../widgets/IconTagList'
import { states } from '../../types/lernfair/State'
import { useTranslation } from 'react-i18next'

const UserState: React.FC = () => {
  const { userState, setUserState, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space } = useTheme()
  const { t } = useTranslation()
  return (
    <VStack flex="1">
      <Heading>{t(`registration.steps.4.subtitle`)}</Heading>
      <Row flexWrap="wrap" w="100%" mt={space['1']}>
        {states.map((state, i) => (
          <Column mb={space['0.5']} mr={space['0.5']}>
            <IconTagList
              initial={userState === state.key}
              text={state.label}
              onPress={() => setUserState(state.key)}
              iconPath={`states/icon_${state.key}.svg`}
            />
          </Column>
        ))}
      </Row>
      <Button onPress={() => setCurrentIndex(5)}>Weiter</Button>
    </VStack>
  )
}
export default UserState
