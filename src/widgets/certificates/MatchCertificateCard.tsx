import { useMutation } from '@apollo/client';
import { DateTime } from 'luxon';
import { useTheme, Card, VStack, Row, Icon, Box, Heading, Text, useToast, Modal, Button } from 'native-base';
import { useState, useCallback } from 'react';
import { BACKEND_URL } from '../../config';
import { gql } from '../../gql';
import { Participation_Certificate } from '../../gql/graphql';
import CertificateMatchIcon from '../../assets/icons/lernfair/lf-certificate-matching.svg';

type Certificate = Pick<
    Participation_Certificate,
    'uuid' | 'categories' | 'endDate' | 'hoursPerWeek' | 'hoursTotal' | 'medium' | 'ongoingLessons' | 'startDate' | 'state'
> & { pupil: { firstname?: string | null; lastname?: string | null } };

export const MatchCertificateCard = ({ certificate }: { certificate: Certificate }) => {
    const { space } = useTheme();
    const toast = useToast();

    const [showSelectPDFLanguageModal, setShowSelectPDFLanguageModal] = useState<boolean>(false);

    const [requestCertificate, requestCertificateState] = useMutation(
        gql(`
            mutation GetCertificate($lang: String!, $uuid: String!) {
                participationCertificateAsPDF(language: $lang, uuid: $uuid)
            }
        `)
    );

    const downloadCertificate = useCallback(
        async (lang: 'de' | 'en') => {
            setShowSelectPDFLanguageModal(false);

            const res = await requestCertificate({
                variables: {
                    lang,
                    uuid: certificate.uuid,
                },
            });

            if (res?.data?.participationCertificateAsPDF) {
                toast.show({ description: 'Dein Zertifikat wird heruntergeladen', placement: 'top' });
                window.open(`${BACKEND_URL}${res?.data?.participationCertificateAsPDF}`, '_blank');
            } else {
                toast.show({ description: 'Beim Download ist ein Fehler aufgetreten', placement: 'top' });
            }
        },
        [certificate, requestCertificate, toast]
    );

    return (
        <>
            <Card padding={space['1']} margin={space['1']} minWidth="300px">
                <VStack>
                    <Row justifyContent="flex-end" alignItems="center">
                        <Box mr={space['0.5']}>
                            <CertificateMatchIcon />
                        </Box>
                        <Heading flex="1">
                            {certificate.pupil.firstname} {certificate.pupil.lastname}
                        </Heading>
                    </Row>
                    <VStack py={space['1']}>
                        <Text>
                            <Text bold mr="0.5">
                                Status:{' '}
                            </Text>
                            <Text>
                                {{ manual: 'Manuell', 'awaiting-approval': 'Warten auf Bestätigung', approved: 'Bestätigt' }[certificate.state] ??
                                    certificate.state}
                            </Text>
                        </Text>
                    </VStack>
                    <Button
                        isDisabled={certificate.state === 'awaiting-approval' || requestCertificateState.loading}
                        variant="outline"
                        onPress={() => setShowSelectPDFLanguageModal(true)}
                    >
                        Herunterladen
                    </Button>
                    {/* <Button isDisabled={isDisabled} variant="link" onPress={onPressDetails}>
                    Details ansehen
                </Button> */}
                </VStack>
            </Card>
            <Modal
                isOpen={showSelectPDFLanguageModal}
                onClose={() => {
                    setShowSelectPDFLanguageModal(false);
                }}
            >
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Body>
                        <VStack space={space['0.5']}>
                            <Heading>Bescheinigung herunterladen</Heading>

                            <>
                                <Button onPress={() => downloadCertificate('de')}>Deutsche Version</Button>
                                <Button onPress={() => downloadCertificate('en')}>Englische Version</Button>
                            </>
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
};
