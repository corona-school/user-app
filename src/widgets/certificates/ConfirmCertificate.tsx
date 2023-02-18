import { DateTime } from 'luxon';
import { Button, Input } from 'native-base';
import { Box, Card, FormControl, Text, useTheme } from 'native-base';
import TextInput from '../../components/TextInput';
import { Participation_Certificate } from '../../gql/graphql';
import { YesNoSelector } from '../YesNoSelector';
import SignatureCanvas from 'react-signature-canvas';
import { useCallback, useEffect, useRef, useState } from 'react';

type CertificateToConfirm = Pick<
    Participation_Certificate,
    'categories' | 'endDate' | 'hoursPerWeek' | 'hoursTotal' | 'medium' | 'ongoingLessons' | 'startDate' | 'state'
> & { student: { firstname?: string | null; lastname?: string | null } };

function ConfirmData({
    certificate,
    isMinor,
    setIsMinor,
    location,
    setLocation,
    goSign,
}: {
    certificate: CertificateToConfirm;
    isMinor: boolean | null;
    setIsMinor: (is: boolean) => void;
    location: string;
    setLocation: (it: string) => void;
    goSign: () => void;
}) {
    const { space } = useTheme();
    const [confirmed, setConfirmed] = useState(false);

    return (
        <>
            <Card bg="primary.900" width="100%">
                <Text color="white" fontWeight="bold">
                    Informationen von {certificate.student.firstname}
                </Text>
                <Text color="white">
                    <ul>
                        <li>ab dem {DateTime.fromISO(certificate.startDate).toFormat('dd.MM.yyyy')}</li>
                        <li>bis zum {DateTime.fromISO(certificate.startDate).toFormat('dd.MM.yyyy')}</li>
                        <li>ca. {certificate.hoursPerWeek} Studen pro Woche</li>
                        <li>ca. {certificate.hoursTotal} Studen insgesamt</li>
                    </ul>
                </Text>
            </Card>

            <Text fontWeight="bold" textAlign="center" paddingTop="50px">
                Stimmen diese Informationen?
            </Text>
            <YesNoSelector
                align="center"
                onPressNo={() => {}}
                onPressYes={() => {
                    setConfirmed(true);
                }}
            />
            {confirmed && (
                <>
                    <Text fontWeight="bold" textAlign="center" paddingTop="50px">
                        Bist du volljährig (18 Jahre oder älter)?
                    </Text>
                    <YesNoSelector
                        align="center"
                        onPressNo={() => {
                            setIsMinor(true);
                        }}
                        onPressYes={() => {
                            setIsMinor(false);
                        }}
                        initialNo={isMinor === true}
                        initialYes={isMinor === false}
                    />
                    {isMinor && (
                        <Card bg="primary.900" padding={space['1']} marginTop={space['1']}>
                            <Text color="white" fontWeight="bold">
                                Bitte deine Eltern um Bestätigung
                            </Text>
                            <Text color="white">
                                Auf der folgenden Seite müssen deine Eltern unterschreiben, um zu bestätigen das {certificate.student.firstname} dich
                                unterstützt hat.
                            </Text>
                        </Card>
                    )}
                    <FormControl padding={space['1']} marginTop={space['2']}>
                        <FormControl.Label>Ort der Unterschrift</FormControl.Label>
                        <Input value={location} onChangeText={setLocation} />
                    </FormControl>
                    <Button isDisabled={isMinor === null || location.length < 2} variant="solid" margin={space['1']} onPress={goSign}>
                        Zur Unterschrift
                    </Button>
                </>
            )}
        </>
    );
}

function Sign({ isMinor, location }: { isMinor: boolean; location: string }) {
    const signCanvas = useRef<any>(); // https://www.npmjs.com/package/react-signature-canvas
    // NOTE: In some obscure cases (e.g. scaling the canvas) the canvas gets emptied and this state is invalid
    //       Always additionally check signCanvas.current.isEmpty()
    const [isSigned, setIsSigned] = useState(false);

    function prepareSignature() {
        if (!isSigned || signCanvas.current.isEmpty()) return;

        const signatureBase64 = signCanvas.current.toDataURL('image/png', 1.0);

        const signature = {
            signatureParent: isMinor ? signatureBase64 : undefined,
            signaturePupil: !isMinor ? signatureBase64 : undefined,
            location,
        };
        // signCertificate(certificate, signature);
        // close();
    }

    const updateSigned = useCallback(() => setIsSigned(!signCanvas.current.isEmpty()), [setIsSigned, signCanvas]);
    // NOTE: Resizing the canvas causes it to be cleared.
    // This is still the better option than https://github.com/agilgur5/react-signature-canvas/issues/57
    // We need our own hook to detect when the canvas gets cleared, as the library does not provide one:
    useEffect(() => {
        window.addEventListener('resize', updateSigned);
        return () => window.removeEventListener('resize', updateSigned);
    }, [updateSigned]);

    function discardSignature() {
        signCanvas.current.clear();
        setIsSigned(false);
    }

    const { colors, space } = useTheme();

    return (
        <>
            <Text fontWeight="bold" marginBottom={space['1']}>
                {isMinor ? 'Unterschrift eines Erziehungsberechtigten' : 'Deine Unterschrift'}
            </Text>
            <Box borderBottomColor={colors['primary']['900']} borderBottomStyle="solid" borderBottomWidth="2px" marginBottom={space['0.5']}>
                <SignatureCanvas
                    backgroundColor={colors['primary']['200']}
                    ref={(ref) => {
                        // eslint-disable-next-line
                        signCanvas.current = ref;
                    }}
                    onEnd={updateSigned}
                />
            </Box>
            <Text>
                {location}, den {DateTime.now().toFormat('dd.MM.yyyy')}
            </Text>
            <Box marginTop={space['2']} display="flex" flexDirection="row">
                <Button isDisabled={!isSigned} onPress={discardSignature} flexGrow="1" marginRight={space['1']} variant="primary">
                    Löschen
                </Button>
                <Button isDisabled={!isSigned} onPress={prepareSignature} flexGrow="2">
                    Unterschreiben
                </Button>
            </Box>
        </>
    );
}

export function ConfirmCertificate({ certificate }: { certificate: CertificateToConfirm }) {
    const { space } = useTheme();
    const [location, setLocation] = useState('');
    const [isMinor, setIsMinor] = useState<boolean | null>(null);
    const [sign, setSign] = useState(false);

    return (
        <Box padding={space['1']} height="100%" overflow="scroll" width="100%" maxWidth="600px" alignSelf="center">
            {!sign && (
                <ConfirmData
                    goSign={() => setSign(true)}
                    certificate={certificate}
                    isMinor={isMinor}
                    setIsMinor={setIsMinor}
                    location={location}
                    setLocation={setLocation}
                />
            )}
            {sign && <Sign isMinor location={location} />}
            <Box height="300px" />
        </Box>
    );
}
