import { DateTime } from 'luxon';
import { Heading, Input, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Box, Card, FormControl, Text, useTheme } from 'native-base';
import TextInput from '../../components/TextInput';
import { Participation_Certificate } from '../../gql/graphql';
import { YesNoSelector } from '../../components/YesNoSelector';
import SignatureCanvas from 'react-signature-canvas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '../../gql';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import useModal from '../../hooks/useModal';
import { SuccessModal } from '../../modals/SuccessModal';
import { IMPORTANT_INFORMATION_QUERY } from '../ImportantInformation';
import DisableableButton from '../../components/DisablebleButton';

export type CertificateToConfirm = Pick<
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
    const { t } = useTranslation();
    const [confirmed, setConfirmed] = useState<boolean | null>(null);

    return (
        <VStack overflow="auto">
            <Card bg="primary.900" width="100%">
                <Text color="white" fontWeight="bold">
                    {t('matching.certificate.title', { firstname: certificate.student.firstname })}
                </Text>
                <Text color="white">
                    <VStack>
                        <Text>
                            {`\u2022  ${t('matching.certificate.from')}`} {DateTime.fromISO(certificate.startDate).toFormat('dd.MM.yyyy')}
                        </Text>
                        <Text>
                            {`\u2022  ${t('matching.certificate.to')}`} {DateTime.fromISO(certificate.endDate).toFormat('dd.MM.yyyy')}
                        </Text>
                        <Text>
                            {`\u2022  ${t('matching.certificate.approx')}`} {certificate.hoursPerWeek} {t('matching.certificate.hoursPerWeek')}
                        </Text>
                        <Text>
                            {`\u2022  ${t('matching.certificate.approx')}`} {certificate.hoursTotal} {t('matching.certificate.totalHours')}
                        </Text>
                        <Text>{`\u2022  ${t('matching.certificate.contents')}`}</Text>
                        <VStack paddingLeft="16px">
                            {certificate.categories.split('\n').map((it) => (
                                <Text>{`\u2022  ${it}`}</Text>
                            ))}
                        </VStack>
                    </VStack>
                </Text>
            </Card>

            <Text fontWeight="bold" textAlign="center" paddingTop="50px">
                {t('matching.certificate.correctInformation')}
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
                        {t('matching.certificate.requestChange', { firstname: certificate.student.firstname })}
                    </Text>
                    <Text color="white">{t('matching.certificate.requestInstructions', { firstname: certificate.student.firstname })}</Text>
                </Card>
            )}
            {confirmed && (
                <>
                    <Text fontWeight="bold" textAlign="center" paddingTop="50px">
                        {t('matching.certificate.areYou18')}
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
                                {t('matching.certificate.askYourParents')}
                            </Text>
                            <Text color="white">{t('matching.certificate.signInstructionsParents', { firstname: certificate.student.firstname })}</Text>
                        </Card>
                    )}
                    <FormControl padding={space['1']} marginTop={space['2']}>
                        <FormControl.Label> {t('matching.certificate.signPlace')}</FormControl.Label>
                        <Input value={location} onChangeText={setLocation} />
                    </FormControl>
                    <DisableableButton
                        isDisabled={isMinor === null || location.length < 2}
                        reasonDisabled={t('reasonsDisabled.formIncomplete')}
                        variant="solid"
                        margin={space['1']}
                        onPress={goSign}
                    >
                        {t('matching.certificate.goToSign')}
                    </DisableableButton>
                </>
            )}
        </VStack>
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
    const { t } = useTranslation();

    return (
        <>
            <Text fontWeight="bold" marginBottom={space['1']}>
                {isMinor ? t('matching.certificate.signatureParent') : t('matching.certificate.signatureYour')}
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
                {location}, {t('matching.certificate.dateFiller')} {DateTime.now().toFormat('dd.MM.yyyy')}
            </Text>
            <Box marginTop={space['2']} display="flex" flexDirection="row">
                <DisableableButton
                    isDisabled={!isSigned}
                    reasonDisabled={t('reasonsDisabled.missingSignature')}
                    onPress={discardSignature}
                    flexGrow="1"
                    marginRight={space['1']}
                    variant="primary"
                >
                    {t('delete')}
                </DisableableButton>
                <DisableableButton isDisabled={!isSigned} reasonDisabled={t('reasonsDisabled.missingSignature')} onPress={prepareSignature} flexGrow="2">
                    {t('matching.certificate.sign')}
                </DisableableButton>
            </Box>
        </>
    );
}

export function ConfirmCertificate({ certificate }: { certificate: CertificateToConfirm }) {
    const { space } = useTheme();
    const { t } = useTranslation();
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
                <SuccessModal title={t('matching.certificate.success')} content={t('matching.certificate.successInfo')} />
            );
        }

        if (error) {
            throw new Error(`Failed to sign certificate with`, error);
        }
    }, [data, error]);

    return (
        <Box padding={space['1']} height="100%" overflow="auto" width="100%" maxWidth="600px" alignSelf="center">
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
        </Box>
    );
}
