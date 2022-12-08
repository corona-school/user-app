import { Button, Column, Heading, Row, useTheme, VStack } from 'native-base'
import { useContext } from 'react'
import { RegistrationContext } from '../Registration'
import IconTagList from '../../widgets/IconTagList'
import { schooltypes } from '../../types/lernfair/SchoolType'
import { useTranslation } from 'react-i18next'

const SchoolType: React.FC = () => {
  const { schoolType, setSchoolType, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <VStack flex="1">
      <Heading>{t(`registration.steps.3.subtitle`)}</Heading>
      <Row flexWrap="wrap" w="100%" mt={space['1']}>
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
      <Button onPress={() => setCurrentIndex(4)}>Weiter</Button>
    </VStack>
  )
}
export default SchoolType
