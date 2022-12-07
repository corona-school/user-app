import { Button, Column, Heading, Row, useTheme, VStack } from 'native-base'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { RegistrationContext } from '../Registration'
import IconTagList from '../../widgets/IconTagList'

const SchoolClass: React.FC = () => {
  const { schoolClass, setSchoolClass, setCurrentIndex } =
    useContext(RegistrationContext)
  const { space } = useTheme()
  const { t } = useTranslation()

  return (
    <VStack flex="1">
      <Heading>In welcher Klasse bist du?</Heading>
      <Row flexWrap="wrap" w="100%" mt={space['1']}>
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
      <Button onPress={() => setCurrentIndex(3)}>Weiter</Button>
    </VStack>
  )
}
export default SchoolClass
