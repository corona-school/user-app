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
import { useTranslation } from 'react-i18next'
import { RegistrationContext } from '../Registration'
import IconTagList from '../../widgets/IconTagList'
import { useNavigate } from 'react-router-dom'

const SchoolClass: React.FC = () => {
  const { schoolClass, setSchoolClass, setCurrentIndex } =
    useContext(RegistrationContext)
  const navigate = useNavigate()
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <VStack flex="1" marginTop={space['1']}>
      <Heading>{t(`registration.steps.2.subtitle`)}</Heading>
      <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['1']}>
        {new Array(13).fill(0).map((_, i) => (
          <Column mb={space['0.5']} mr={space['0.5']}>
            <IconTagList
              initial={schoolClass === i + 1}
              textIcon={`${i + 1}`}
              text={t('lernfair.schoolclass', {
                class: i + 1
              })}
              onPress={() => setSchoolClass(i + 1)}
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
                setCurrentIndex(1)
              }}>
              {t('lernfair.buttons.prev')}
            </Button>
          </Column>
          <Column width="100%">
            <Button width="100%" onPress={() => setCurrentIndex(3)}>
              {t('lernfair.buttons.next')}
            </Button>
          </Column>
        </Row>
      </Box>
    </VStack>
  )
}
export default SchoolClass
