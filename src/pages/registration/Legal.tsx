import { Box, Button, Checkbox, ChevronDownIcon, ChevronUpIcon, Column, Heading, Link, Row, Text, useTheme, VStack } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import AlertMessage from '../../widgets/AlertMessage';
import { RegistrationContext } from '../Registration';
import BulletList from '../../components/BulletList';
import { usePageTitle } from '../../hooks/usePageTitle';

type Props = {
    onRegister: () => any;
};

const Legal: React.FC<Props> = ({ onRegister }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { userType, setNewsletter, onPrev } = useContext(RegistrationContext);
    const [checks, setChecks] = useState<string[]>([]);
    const [errors, setErrors] = useState<{
        dsgvo: boolean;
        straftaten: boolean;
    }>({
        dsgvo: false,
        straftaten: false,
    });
    usePageTitle(`Lern-Fair - Registrierung: Einwilligungen für ${userType === 'pupil' ? 'Schüler:innen' : 'Helfer:innen'}`);

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

    const next = useCallback(() => {
        if (isInputValid()) {
            onRegister();
        }
    }, [isInputValid, onRegister]);

    return (
        <VStack marginTop="10px">
            <Heading>{t(`registration.steps.legal.subtitle`)}</Heading>

            <Checkbox.Group onChange={(values) => setChecks(values || [])} value={checks} mt={space['1']}>
                <VStack space={space['0.5']}>
                    <Heading fontSize="md">{t(`registration.legal.privacy`)}</Heading>
                    <Text>{t(`registration.legal.whatHappensWithData`)}</Text>
                    <BulletList
                        bulletPoints={[t(`registration.legal.usageBullets.1`), t(`registration.legal.usageBullets.2`), t(`registration.legal.usageBullets.3`)]}
                    />
                    <Checkbox value={'dsgvo'} alignItems="flex-start">
                        <Text>
                            {t(`registration.legal.accept`)}
                            <Link onPress={() => window.open('/datenschutz', '_blank')}>{t(`registration.legal.privacypolicy`)}</Link>
                            <Required />
                        </Text>
                    </Checkbox>

                    <Row alignItems="flex-start" mt={space['0.5']} ml="28px">
                        <Accordion title={t(`registration.legal.accordionUsDataProcessors.title`)}>
                            <Text>{t(`registration.legal.accordionUsDataProcessors.body`)}</Text>
                        </Accordion>
                    </Row>

                    {errors['dsgvo'] && <AlertMessage content={t(`registration.legal.error.confirmPolicy`)} />}

                    {userType === 'student' && (
                        <VStack space={space['0.5']} mt={space['1']}>
                            <Heading fontSize="md">{t(`registration.legal.selfCommitment`)}</Heading>
                            <Checkbox value="straftaten" alignItems="flex-start">
                                <Text>
                                    {t(`registration.legal.noInvestigation`)}{' '}
                                    <Link onPress={() => window.open('/selbstverpflichtungserklaerung', '_blank')}>
                                        {t(`registration.legal.selfCommitment`)}
                                    </Link>
                                    <Required />
                                </Text>
                            </Checkbox>
                            {errors['straftaten'] && <AlertMessage content={t(`registration.legal.error.confirmNoInvestigation`)} />}
                        </VStack>
                    )}

                    <Heading fontSize="md" mt={space['2']}>
                        {t(`registration.legal.newsletter`)}
                    </Heading>
                    <Checkbox value="newsletter" alignItems="flex-start" mr={space['0.5']} onChange={(e) => setNewsletter(e)}>
                        <Text>{t(`registration.legal.newsletterAgreement`)}</Text>
                    </Checkbox>

                    <Text my={space['1']}>{t(`registration.legal.underageDisclaimer`)}</Text>

                    <Box alignItems="center" marginTop={space['2']}>
                        <Row space={space['1']} justifyContent="center">
                            <Column width="100%">
                                <Button width="100%" height="100%" variant="ghost" colorScheme="blueGray" onPress={onPrev}>
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
