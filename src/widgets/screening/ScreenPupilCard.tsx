import { useMutation } from '@apollo/client';
import { VStack, Heading, HStack, Button, TextArea, useTheme, Stack, useMediaQuery } from 'native-base';
import { useMemo, useState } from 'react';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { InfoCard } from '../../components/InfoCard';
import { gql } from '../../gql';
import { PupilScreeningStatus, Pupil_Screening_Status_Enum } from '../../gql/graphql';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { SuccessModal } from '../../modals/SuccessModal';
import { PupilForScreening, PupilScreening } from '../../types';
import HSection from '../HSection';
import { MatchStudentCard } from '../matching/MatchStudentCard';
import { PupilScreeningCard } from './PupilScreeningCard';

function EditScreening({ pupil, screening }: { pupil: PupilForScreening; screening: PupilScreening }) {
    const isDispute = screening!.status! === Pupil_Screening_Status_Enum.Dispute;

    const { space } = useTheme();

    const [screeningComment, setScreeningComment] = useState(screening!.comment!);

    const [confirmRejection, setConfirmRejection] = useState(false);
    const [confirmSuccess, setConfirmSuccess] = useState(false);
    const [confirmDeactivation, setConfirmDeactivation] = useState(false);

    const [storeEdit, { loading, data }] = useMutation(
        gql(`
            mutation UpdateScreening($id: Float!, $screeningComment: String!, $status: PupilScreeningStatus!) {
                pupilUpdateScreening(pupilScreeningId: $id, data: {
                    comment: $screeningComment,
                    status: $status
                })
            }
        `)
    );

    const [deactivateAccount, { loading: loadingDeactivation, data: deactivateResult }] = useMutation(
        gql(`
            mutation ScreenerDeactivatePupil($pupilId: Float!) { pupilDeactivate(pupilId: $pupilId) }
        `)
    );

    // For privacy, we deliberately clear the comment field when storing the final decision:

    function rejection() {
        setConfirmRejection(false);
        storeEdit({ variables: { id: screening!.id!, screeningComment: '', status: PupilScreeningStatus.Rejection } });
    }

    function success() {
        setConfirmSuccess(false);
        storeEdit({ variables: { id: screening!.id!, screeningComment: '', status: PupilScreeningStatus.Success } });
    }

    function deactivate() {
        setConfirmDeactivation(false);
        storeEdit({ variables: { id: screening!.id!, screeningComment: '', status: PupilScreeningStatus.Rejection } });
        deactivateAccount({ variables: { pupilId: pupil!.id! } });
    }

    return (
        <>
            {screening!.status! === Pupil_Screening_Status_Enum.Dispute && (
                <InfoCard icon="loki" title="Vier Augen" message="Dieser Schüler wurde bereits gescreent, aber eine Entscheidung steht noch aus" />
            )}
            <VStack flexGrow="1" space={space['1']}>
                <TextArea value={screeningComment} onChangeText={setScreeningComment} minH="500px" width="100%" autoCompleteType="" />

                <HStack space={space['1']} display="flex">
                    {(loading || loadingDeactivation) && <CenterLoadingSpinner />}
                    {data && <InfoCard icon="yes" title="Screening gespeichert" message="" />}
                    {deactivateResult && <InfoCard icon="no" title="Account Deaktiviert" message="" />}
                    {!loading && !loadingDeactivation && !data && !deactivateResult && (
                        <>
                            <Button
                                onPress={() => {
                                    storeEdit({ variables: { id: screening!.id!, screeningComment, status: PupilScreeningStatus.Dispute } });
                                }}
                                variant={isDispute ? 'outline' : 'solid'}
                            >
                                Speichern & Vier Augen
                            </Button>
                            <Button onPress={() => setConfirmSuccess(true)} variant={isDispute ? 'solid' : 'outline'}>
                                Annehmen
                            </Button>
                            <Button onPress={() => setConfirmRejection(true)} variant={'outline'}>
                                Ablehnen
                            </Button>
                            <Button onPress={() => setConfirmDeactivation(true)} variant="outline" borderColor="orange.900">
                                Account Deaktivieren
                            </Button>
                            <ConfirmModal
                                isOpen={confirmRejection}
                                onClose={() => setConfirmRejection(false)}
                                onConfirmed={rejection}
                                text={`Willst du ${pupil.firstname} ${pupil.lastname} wirklich ablehnen?`}
                            />
                            <ConfirmModal
                                isOpen={confirmSuccess}
                                onClose={() => setConfirmSuccess(false)}
                                onConfirmed={success}
                                text={`Willst du ${pupil.firstname} ${pupil.lastname} annehmen?`}
                            />
                            <ConfirmModal
                                danger
                                isOpen={confirmDeactivation}
                                onClose={() => setConfirmDeactivation(false)}
                                onConfirmed={deactivate}
                                text={`Willst du ${pupil.firstname} ${pupil.lastname} wirklich deaktivieren?`}
                            />
                        </>
                    )}
                </HStack>
            </VStack>
        </>
    );
}

function PupilHistory({ pupil, previousScreenings }: { pupil: PupilForScreening; previousScreenings: PupilScreening[] }) {
    const { space } = useTheme();

    const activeMatches = pupil!.matches!.filter((it) => !it!.dissolved);
    const dissolvedMatches = pupil.matches!.filter((it) => it!.dissolved);

    return (
        <HStack space={space['2']}>
            {activeMatches.length > 0 && (
                <VStack space={space['1']}>
                    <Heading>Aktive Zuordnungen</Heading>
                    {activeMatches.map((it) => (
                        <MatchStudentCard match={it} />
                    ))}
                </VStack>
            )}
            {dissolvedMatches.length > 0 && (
                <VStack space={space['1']}>
                    <Heading>Aufgelöste Zuordnungen</Heading>
                    {dissolvedMatches.map((it) => (
                        <MatchStudentCard match={it} />
                    ))}
                </VStack>
            )}
            {previousScreenings.length > 0 && (
                <VStack space={space['1']}>
                    <Heading>Vorherige Screenings</Heading>
                    {previousScreenings.map((screening) => (
                        <PupilScreeningCard pupil={pupil} screening={screening} />
                    ))}
                </VStack>
            )}
        </HStack>
    );
}

export function ScreenPupilCard({ pupil }: { pupil: PupilForScreening }) {
    const { space } = useTheme();

    const { previousScreenings, screeningToEdit } = useMemo(() => {
        const previousScreenings: PupilScreening[] = [...pupil!.screenings!];
        let screeningToEdit: PupilScreening | null = null;

        previousScreenings.sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));

        if (
            previousScreenings.length > 0 &&
            !previousScreenings[0]!.invalidated &&
            (previousScreenings[0]!.status === Pupil_Screening_Status_Enum.Pending || previousScreenings[0]!.status === Pupil_Screening_Status_Enum.Dispute)
        ) {
            screeningToEdit = previousScreenings.shift();
        }

        return { previousScreenings, screeningToEdit };
    }, [pupil!.screenings!]);

    return (
        <VStack paddingTop="20px" space={space['2']}>
            <Heading fontSize="30px">
                Schüler:in / {pupil.firstname} {pupil.lastname}
            </Heading>
            {!screeningToEdit && (
                <InfoCard icon="loki" title="Kein offenes Screening" message="Der Schüler hat kein offenes Screening bei dem eine Fallentscheidung aussteht." />
            )}
            {screeningToEdit && <EditScreening pupil={pupil} screening={screeningToEdit} />}
            <PupilHistory pupil={pupil} previousScreenings={previousScreenings} />
        </VStack>
    );
}
