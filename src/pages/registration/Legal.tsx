import {
  Box,
  Button,
  Checkbox,
  ChevronDownIcon,
  ChevronUpIcon,
  Link,
  Row,
  Text,
  useTheme,
  VStack
} from 'native-base'
import { useCallback, useContext, useState } from 'react'
import { Pressable } from 'react-native'
import AlertMessage from '../../widgets/AlertMessage'
import { RegistrationContext } from '../Registration'

type Props = {
  onRegister: () => any
}

const Legal: React.FC<Props> = ({ onRegister }) => {
  const { space } = useTheme()
  const { userType, setNewsletter } = useContext(RegistrationContext)
  const [checks, setChecks] = useState<string[]>([])
  const [errors, setErrors] = useState<{
    dsgvo: boolean
    usa: boolean
    straftaten: boolean
  }>({
    dsgvo: false,
    usa: false,
    straftaten: false
  })

  const isInputValid = useCallback(() => {
    if (userType === 'pupil') {
      setErrors({
        straftaten: true,
        dsgvo: !checks.includes('dsgvo'),
        usa: !checks.includes('usa')
      })
      return checks.includes('dsgvo') && checks.includes('usa')
    } else {
      setErrors({
        dsgvo: !checks.includes('dsgvo'),
        usa: !checks.includes('usa'),
        straftaten: !checks.includes('straftaten')
      })
      return (
        checks.includes('dsgvo') &&
        checks.includes('usa') &&
        checks.includes('straftaten')
      )
    }
  }, [checks, userType])

  const next = useCallback(() => {
    if (isInputValid()) {
      if (checks.includes('newsletter')) {
        setNewsletter(true)
      }
      onRegister()
    }
  }, [checks, isInputValid, onRegister, setNewsletter])

  return (
    <Checkbox.Group onChange={setChecks} value={checks}>
      <VStack>
        <Checkbox value={'dsgvo'} alignItems="flex-start">
          <Text>
            Ich habe die{' '}
            <Link onPress={() => window.open('/datenschutz', '_blank')}>
              Datenschutzbestimmungen
            </Link>{' '}
            zur Kenntnis genommen und bin damit einverstanden, dass der
            Lern-Fair e.V. meine persönlichen Daten entsprechend des Zwecks,
            Umfangs und der Dauer wie in der Datenschutzerklärung angegeben,
            verarbeitet und gespeichert werden. Mir ist insbesondere bewusst,
            dass die von mir angegebenen Daten zur Durchführung der Angebote an
            zugeteilte Nutzer:innen weitergegeben werden und deren Mailadressen
            ggf. von Anbietern außerhalb der EU zur Verfügung gestellt werden,
            die die Einhaltung des europäischen Datenschutzniveaus nicht
            gewährleisten können. <Required />
          </Text>
        </Checkbox>

        <Row alignItems="flex-start" mt={space['1']} ml="28px">
          <Accordion title="Datenverarbeitung durch Auftragsverarbeiter in den USA">
            <Text>
              Ich stimme ferner ausdrücklich der Verarbeitung meiner
              personenbezogenen Daten über unsere in den USA sitzenden
              Auftragsverarbeiter Google und Heroku zu, die die Einhaltung des
              europäischen Datenschutzniveaus aufgrund der Möglichkeit von
              Anfragen von US-Nachrichtendiensten nicht gewährleisten können. Zu
              diesem Zweck hat Lern-Fair Standardvertragsklauseln abgeschlossen
              und weitergehende Sicherheitsmaßnahmen vereinbart, Art. 46 Abs. 2
              lit. c DSGVO.
            </Text>
          </Accordion>
        </Row>

        {errors['dsgvo'] && (
          <AlertMessage content="Bitte bestätige die Datenschutzbestimmungen." />
        )}

        {userType === 'student' && (
          <>
            <Checkbox
              value="straftaten"
              alignItems="flex-start"
              mt={space['1']}>
              <Text>
                Ich versichere, nicht wegen einer in{' '}
                <Link
                  onPress={() =>
                    window.open('/selbstverpflichtungserklaerung', '_blank')
                  }>
                  § 72a Abs. 1 Satz 1 SGB VIII
                </Link>
                 bezeichneten Straftat rechtskräftig verurteilt worden zu sein
                und dass derzeit kein Ermittlungsverfahren wegen einer solchen
                Straftat gegen mich läuft. <Required />
              </Text>
            </Checkbox>
            {errors['straftaten'] && (
              <AlertMessage content="Bitte bestätige diese Aussage." />
            )}
          </>
        )}

        <Checkbox
          mt={space['2']}
          value="newsletter"
          alignItems="flex-start"
          mr={space['0.5']}>
          <Text>
            Ich möchte von Lern-Fair über Angebote, Aktionen und weitere
            Unterstützungsmöglichkeiten per E-Mail informiert werden.
          </Text>
        </Checkbox>

        <Text my={space['1']}>
          Hinweis: Für den Fall, dass die einwilligende Person das 18.
          Lebensjahr noch nicht vollendet hat, hat der Träger der elterlichen
          Verantwortung für die Person die Einwilligung zu erklären.
        </Text>

        <Button onPress={next}>Jetzt registrieren</Button>
      </VStack>
    </Checkbox.Group>
  )
}

const Accordion: React.FC<{
  title: string
  children: JSX.Element
  required?: boolean
}> = ({ title, children, required }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <VStack flex="1">
      <Box>
        <Pressable onPress={() => setIsOpen(prev => !prev)}>
          <Row alignItems={'center'} flexWrap="nowrap">
            <Text fontSize="md" mr="2">
              {title}
              {required && (
                <Box ml="1">
                  <Required />
                </Box>
              )}
            </Text>
            {isOpen ? (
              <ChevronUpIcon color="primary.500" />
            ) : (
              <ChevronDownIcon color="primary.500" />
            )}
          </Row>
        </Pressable>
      </Box>

      {isOpen && <Box mt="1">{children}</Box>}
    </VStack>
  )
}

const Required: React.FC = () => <Text color="red.500">*</Text>

export default Legal
