import {
  Box,
  Button,
  Column,
  Heading,
  Row,
  useTheme,
  VStack
} from 'native-base'
import { useContext } from 'react'
import { RegistrationContext } from '../Registration'
import IconTagList from '../../widgets/IconTagList'
import { schooltypes } from '../../types/lernfair/SchoolType'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const SchoolType: React.FC = () => {
  const { schoolType, setSchoolType, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space } = useTheme()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <VStack flex="1" marginTop={space['1']}>
      <Heading>{t(`registration.steps.3.subtitle`)}</Heading>
      <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['1']}>
        {schooltypes.map((type, i) => (
          <Column mb={space['0.5']} mr={space['0.5']}>
            <IconTagList
              initial={schoolType === type.key}
              text={type.label}
              onPress={() => setSchoolType(type.key)}
              iconPath={`schooltypes/icon_${type.key}.svg`}
            />
          </Column>
        ))}
      </Row>
      <Box alignItems="center" marginTop={space['2']}>
        <Row space={space['1']} justifyContent="center">
          <Column width="100%">
            <Button
              width="100%"
              height="100%"
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setCurrentIndex(2)
              }}>
              {t('lernfair.buttons.prev')}
            </Button>
          </Column>
          <Column width="100%">
            <Button width="100%" onPress={() => setCurrentIndex(4)}>
              {t('lernfair.buttons.next')}
            </Button>
          </Column>
        </Row>
      </Box>
    </VStack>
  )
}
export default SchoolType
