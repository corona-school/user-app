import { Box, Button, Checkbox, ChevronDownIcon, ChevronUpIcon, Column, Heading, Link, List, Row, Text, useTheme, VStack } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../../widgets/AlertMessage';
import { RegistrationContext } from '../Registration';
import ListItem from '../../widgets/ListItem';
import BulletList from '../../components/BulletList';

type Props = {
    onRegister: () => any;
};

const Legal: React.FC<Props> = ({ onRegister }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userType, setNewsletter, setCurrentIndex } = useContext(RegistrationContext);
    const [checks, setChecks] = useState<string[]>([]);
    const [errors, setErrors] = useState<{
        dsgvo: boolean;
        straftaten: boolean;
    }>({
        dsgvo: false,
        straftaten: false,
    });

    const isInputValid = useCallback(() => {
        if (userType === 'pupil') {
            setErrors({
                straftaten: true,
                dsgvo: !checks.includes('dsgvo'),
            });
            return checks.includes('dsgvo');
        } else {
            setErrors({
                dsgvo: !checks.includes('dsgvo'),
                straftaten: !checks.includes('straftaten'),
            });
            return checks.includes('dsgvo') && checks.includes('straftaten');
        }
    }, [checks, userType]);

    const goBack = () => {
        if (userType === 'pupil') {
            setCurrentIndex(4);
        } else {
            setCurrentIndex(1);
        }
    };

    const next = useCallback(() => {
        if (isInputValid()) {
            onRegister();
        }
    }, [isInputValid, onRegister]);

    return (
        <VStack marginTop="10px">
            <Heading>{t(`registration.steps.5.subtitle`)}</Heading>

            <Checkbox.Group onChange={(values) => setChecks(values || [])} value={checks} mt={space['1']}>
                <VStack space={space['0.5']}>
                    <Heading fontSize="md">Datenschutz</Heading>
                    <Text>Das passiert mit deinen Daten, wenn du dich bei Lern-Fair registrierst:</Text>
                    <BulletList
                        bulletPoints={[
                            'Wir speichern deine Daten solange dein Account bei Lern-Fair aktiv ist und löschen diese spätestens 3 Jahre nach der Deaktivierung deines Accounts',
                            'Wir teilen Informationen zu deiner Person (Name, Schulform, Jahrgangsstufe, Bundesland, Fächer) mit Helfer:innen, die dich unterstützen werden',
                            'Wir nutzen Angebote von Heroku, Mailjet, Datadog und Google zur Verarbeitung deiner Daten, die eventuell das europäische Datenschutzniveau nicht gewährleisten können',
                        ]}
                    />
                    <Checkbox value={'dsgvo'} alignItems="flex-start">
                        <Text>
                            Ich habe die <Link onPress={() => window.open('/datenschutz', '_blank')}>Datenschutzbestimmungen</Link> zur Kenntnis genommen.
                            <Required />
                        </Text>
                    </Checkbox>

                    <Row alignItems="flex-start" mt={space['0.5']} ml="28px">
                        <Accordion title="Datenverarbeitung durch Auftragsverarbeiter in den USA">
                            <Text>
                                Ich nehme zur Kenntnis, dass die Verarbeitung meiner personenbezogenen Daten über unsere in den USA sitzenden
                                Auftragsverarbeiter Google und Heroku erfolgt, die die Einhaltung des europäischen Datenschutzniveaus aufgrund der Möglichkeit
                                von Anfragen von US-Nachrichtendiensten nicht gewährleisten können. Zu diesem Zweck hat Lern-Fair Standardvertragsklauseln
                                abgeschlossen und weitergehende Sicherheitsmaßnahmen vereinbart, Art. 46 Abs. 2 lit. c DSGVO.
                            </Text>
                        </Accordion>
                    </Row>

                    {errors['dsgvo'] && <AlertMessage content="Bitte bestätige die Datenschutzbestimmungen." />}

                    {userType === 'student' && (
                        <VStack space={space['0.5']} mt={space['1']}>
                            <Heading fontSize="md">Selbstverpflichtungserklärung</Heading>
                            <Checkbox value="straftaten" alignItems="flex-start">
                                <Text>
                                    Ich versichere, nicht wegen einer in{' '}
                                    <Link onPress={() => window.open('/selbstverpflichtungserklaerung', '_blank')}>§ 72a Abs. 1 Satz 1 SGB VIII</Link>
                                     bezeichneten Straftat rechtskräftig verurteilt worden zu sein und dass derzeit kein Ermittlungsverfahren wegen einer
                                    solchen Straftat gegen mich läuft. <Required />
                                </Text>
                            </Checkbox>
                            {errors['straftaten'] && <AlertMessage content="Bitte bestätige diese Aussage." />}
                        </VStack>
                    )}

                    <Heading fontSize="md" mt={space['2']}>
                        Newsletter
                    </Heading>
                    <Checkbox value="newsletter" alignItems="flex-start" mr={space['0.5']} onChange={(e) => setNewsletter(e)}>
                        <Text>Ich möchte von Lern-Fair über Angebote, Aktionen und weitere Unterstützungsmöglichkeiten per E-Mail informiert werden.</Text>
                    </Checkbox>

                    <Text my={space['1']}>
                        Hinweis: Für den Fall, dass die einwilligende Person das 18. Lebensjahr noch nicht vollendet hat, hat der Träger der elterlichen
                        Verantwortung für die Person die Einwilligung zu erklären.
                    </Text>

                    <Box alignItems="center" marginTop={space['2']}>
                        <Row space={space['1']} justifyContent="center">
                            <Column width="100%">
                                <Button width="100%" height="100%" variant="ghost" colorScheme="blueGray" onPress={goBack}>
                                    {t('back')}
                                </Button>
                            </Column>
                            <Column width="100%">
                                <Button width="100%" onPress={next}>
                                    {t('signup')}
                                </Button>
                            </Column>
                        </Row>
                    </Box>
                </VStack>
            </Checkbox.Group>
        </VStack>
    );
};

const Accordion: React.FC<{
    title: string;
    children: JSX.Element;
    required?: boolean;
}> = ({ title, children, required }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <VStack flex="1">
            <Box>
                <Pressable onPress={() => setIsOpen((prev) => !prev)}>
                    <Row alignItems={'center'} flexWrap="nowrap">
                        <Text fontSize="md" mr="2">
                            {title}
                            {required && (
                                <Box ml="1">
                                    <Required />
                                </Box>
                            )}
                        </Text>
                        {isOpen ? <ChevronUpIcon color="primary.500" /> : <ChevronDownIcon color="primary.500" />}
                    </Row>
                </Pressable>
            </Box>

            {isOpen && <Box mt="1">{children}</Box>}
        </VStack>
    );
};

const Required: React.FC = () => <Text color="red.500">*</Text>;

export default Legal;
