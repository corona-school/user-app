import { DateTime } from 'luxon';
import { Button, Input } from 'native-base';
import { Box, Card, FormControl, Text, useTheme } from 'native-base';
import TextInput from '../../components/TextInput';
import { Participation_Certificate } from '../../gql/graphql';
import { YesNoSelector } from '../YesNoSelector';
import SignatureCanvas from 'react-signature-canvas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '../../gql';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import useModal from '../../hooks/useModal';
import { SuccessModal } from '../../modals/SuccessModal';
import { IMPORTANT_INFORMATION_QUERY } from '../ImportantInformation';

type CertificateToConfirm = Pick<
    Participation_Certificate,
    'uuid' | 'categories' | 'endDate' | 'hoursPerWeek' | 'hoursTotal' | 'medium' | 'ongoingLessons' | 'startDate' | 'state'
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
    const [confirmed, setConfirmed] = useState<boolean | null>(null);

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
                onPressNo={() => {
                    setConfirmed(false);
                }}
                onPressYes={() => {
                    setConfirmed(true);
                }}
                initialNo={confirmed === false}
                initialYes={confirmed === true}
            />
            {confirmed === false && (
                <Card bg="primary.900" padding={space['1']} marginTop={space['1']}>
                    <Text color="white" fontWeight="bold">
                        Bitte {certificate.student.firstname} die Informationen anzupassen
                    </Text>
                    <Text color="white">{certificate.student.firstname} kann in seinem Userbereich die informationen anpassen.</Text>
                </Card>
            )}
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

function Sign({
    certificate,
    isMinor,
    location,
    signCertificate,
}: {
    certificate: CertificateToConfirm;
    isMinor: boolean;
    location: string;
    signCertificate: (it: { certificateId: string; signatureParent?: string; signaturePupil?: string; location: string }) => void;
}) {
    const signCanvas = useRef<any>(); // https://www.npmjs.com/package/react-signature-canvas
    // NOTE: In some obscure cases (e.g. scaling the canvas) the canvas gets emptied and this state is invalid
    //       Always additionally check signCanvas.current.isEmpty()
    const [isSigned, setIsSigned] = useState(false);

    function prepareSignature() {
        if (!isSigned || signCanvas.current.isEmpty()) return;

        const signatureBase64 = signCanvas.current.toDataURL('image/png', 1.0);

        const signature = {
            certificateId: certificate.uuid,
            signatureParent: isMinor ? signatureBase64 : undefined,
            signaturePupil: !isMinor ? signatureBase64 : undefined,
            location,
        };

        signCertificate(signature);
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
    const { show } = useModal();

    const [signCertificate, { loading, data, error }] = useMutation(
        gql(
            `mutation SignCertificate($certificateId: String! $location: String! $signatureParent: String $signaturePupil: String) {
            participationCertificateSign(certificateId: $certificateId signatureLocation: $location signatureParent: $signatureParent signaturePupil: $signaturePupil)
        }`
        ),
        { refetchQueries: [IMPORTANT_INFORMATION_QUERY] }
    );

    useEffect(() => {
        if (data) {
            show(
                { variant: 'dark', closeable: true },
                <SuccessModal title="Zertifikat bestätigt" content="Vielen Dank das du uns geholfen hast, die Arbeit unsererer Helfer:innen zu würdigen." />
            );
        }

        if (error) {
            throw new Error(`Failed to sign certificate with`, error);
        }
    }, [data, error]);

    return (
        <Box padding={space['1']} height="100%" overflow="scroll" width="100%" maxWidth="600px" alignSelf="center">
            {loading && <CenterLoadingSpinner />}
            {!loading && !sign && (
                <ConfirmData
                    goSign={() => setSign(true)}
                    certificate={certificate}
                    isMinor={isMinor}
                    setIsMinor={setIsMinor}
                    location={location}
                    setLocation={setLocation}
                />
            )}
            {!loading && sign && (
                <Sign certificate={certificate} isMinor={isMinor!} location={location} signCertificate={(it) => signCertificate({ variables: it })} />
            )}
            <Box height="300px" />
        </Box>
    );
}
