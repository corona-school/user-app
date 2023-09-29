import { useMutation } from '@apollo/client';
import { VStack, Heading, HStack, Button, TextArea, useTheme, Text } from 'native-base';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { InfoCard } from '../../components/InfoCard';
import { LanguageTagList } from '../../components/LanguageTag';
import { SubjectTagList } from '../../components/SubjectTag';
import { gql } from '../../gql';
import { PupilScreeningStatus, Pupil_Screening_Status_Enum } from '../../gql/graphql';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { PupilForScreening, PupilScreening } from '../../types';
import { MatchStudentCard } from '../matching/MatchStudentCard';
import { PupilScreeningCard } from './PupilScreeningCard';
import { ScreeningSuggestionCard } from './ScreeningSuggestionCard';
import { useUser } from '../../hooks/useApollo';

function EditScreening({ pupil, screening }: { pupil: PupilForScreening; screening: PupilScreening }) {
    const isDispute = screening!.status! === Pupil_Screening_Status_Enum.Dispute;
    const screener = useUser();

    const { space } = useTheme();
    const { t } = useTranslation();

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

    function suggest(positive?: boolean) {
        let resultComment = screeningComment;

        if (positive === true) {
            resultComment += `\n\n[${screener.firstname} ${screener.lastname}]: Annahme empfehlen\n\n`;
        }

        if (positive === false) {
            resultComment += `\n\n[${screener.firstname} ${screener.lastname}]: Ablehnung empfehlen\n\n`;
        }

        storeEdit({ variables: { id: screening!.id!, screeningComment: resultComment, status: PupilScreeningStatus.Dispute } });
    }

    return (
        <>
            {screening!.status! === Pupil_Screening_Status_Enum.Dispute && (
                <InfoCard
                    icon="loki"
                    title={t('screening.four_eyes')}
                    message={
                        t('screening.was_screened_but_no_decision') + '\n\n' + screening.screeners.map((it) => `${it.firstname} ${it.lastname}`).join(', ')
                    }
                />
            )}
            <VStack flexGrow="1" space={space['1']}>
                <TextArea value={screeningComment} onChangeText={setScreeningComment} minH="500px" width="100%" autoCompleteType="" />

                <HStack space={space['1']} display="flex">
                    {(loading || loadingDeactivation) && <CenterLoadingSpinner />}
                    {data && <InfoCard icon="yes" title="" message={t('screening.screening_saved')} />}
                    {deactivateResult && <InfoCard icon="no" title={t('screening.account_deactivated')} message="" />}
                    {!loading && !loadingDeactivation && !data && !deactivateResult && (
                        <>
                            <Button onPress={() => suggest()} variant={isDispute ? 'outline' : 'solid'}>
                                Speichern
                            </Button>
                            <Button onPress={() => suggest(true)} variant={isDispute ? 'outline' : 'solid'}>
                                Annahme empfehlen
                            </Button>
                            <Button onPress={() => suggest(false)} variant={isDispute ? 'outline' : 'solid'}>
                                Ablehnung empfehlen
                            </Button>
                        </>
                    )}
                </HStack>
                <HStack space={space['1']} display="flex">
                    {!loading && !loadingDeactivation && !data && !deactivateResult && (
                        <>
                            <Button onPress={() => setConfirmSuccess(true)} variant={isDispute ? 'solid' : 'outline'}>
                                {t('screening.success')}
                            </Button>
                            <Button onPress={() => setConfirmRejection(true)} variant={'outline'}>
                                {t('screening.rejection')}
                            </Button>
                            <Button onPress={() => setConfirmDeactivation(true)} variant="outline" borderColor="orange.900">
                                {t('screening.deactivate')}
                            </Button>
                            <ConfirmModal
                                isOpen={confirmRejection}
                                onClose={() => setConfirmRejection(false)}
                                onConfirmed={rejection}
                                text={t('screening.confirm_rejection', { firstname: pupil.firstname, lastname: pupil.lastname })}
                            />
                            <ConfirmModal
                                isOpen={confirmSuccess}
                                onClose={() => setConfirmSuccess(false)}
                                onConfirmed={success}
                                text={t('screening.confirm_success', { firstname: pupil.firstname, lastname: pupil.lastname })}
                            />
                            <ConfirmModal
                                danger
                                isOpen={confirmDeactivation}
                                onClose={() => setConfirmDeactivation(false)}
                                onConfirmed={deactivate}
                                text={t('screening.confirm_deactivate', { firstname: pupil.firstname, lastname: pupil.lastname })}
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
    const { t } = useTranslation();

    const activeMatches = pupil!.matches!.filter((it) => !it!.dissolved).sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));
    const dissolvedMatches = pupil.matches!.filter((it) => it!.dissolved).sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));

    return (
        <HStack space={space['2']}>
            {activeMatches.length > 0 && (
                <VStack space={space['1']}>
                    <Heading>{t('screening.active_matches')}</Heading>
                    {activeMatches.map((it, id) => (
                        <MatchStudentCard key={id} match={it} />
                    ))}
                </VStack>
            )}
            {dissolvedMatches.length > 0 && (
                <VStack space={space['1']}>
                    <Heading>{t('screening.dissolved_matches')}</Heading>
                    {dissolvedMatches.map((it, id) => (
                        <MatchStudentCard key={id} match={it} />
                    ))}
                </VStack>
            )}
            {previousScreenings.length > 0 && (
                <VStack space={space['1']}>
                    <Heading>{t('screening.previous_screenings')}</Heading>
                    {previousScreenings.map((screening, id) => (
                        <PupilScreeningCard key={id} screening={screening} />
                    ))}
                </VStack>
            )}
        </HStack>
    );
}

export function ScreenPupilCard({ pupil, refresh }: { pupil: PupilForScreening; refresh: () => void }) {
    const { space } = useTheme();
    const { t } = useTranslation();

    const [createScreening] = useMutation(gql(`mutation CreateScreening($pupilId: Float!) { pupilCreateScreening(pupilId: $pupilId) }`));
    const { previousScreenings, screeningToEdit } = useMemo(() => {
        const previousScreenings: PupilScreening[] = [...pupil!.screenings!];
        let screeningToEdit: PupilScreening | null = null;

        previousScreenings.sort((a, b) => +new Date(b!.createdAt) - +new Date(a!.createdAt));

        if (
            previousScreenings.length > 0 &&
            !previousScreenings[0]!.invalidated &&
            (previousScreenings[0]!.status === Pupil_Screening_Status_Enum.Pending || previousScreenings[0]!.status === Pupil_Screening_Status_Enum.Dispute)
        ) {
            screeningToEdit = previousScreenings.shift()!;
        }

        return { previousScreenings, screeningToEdit };
    }, [pupil!.screenings!]);

    const needsScreening =
        // If the user was not yet invited for screening, they might need a new one
        previousScreenings.length === 0 ||
        // or in case the previous screening was already invalidated
        previousScreenings[0].invalidated;

    // Otherwise the screening is successful and not invalidated yet, so no need to take action

    return (
        <VStack paddingTop="20px" space={space['2']}>
            <Heading fontSize="30px">
                {t('pupil')} / {pupil.firstname} {pupil.lastname}
            </Heading>
            <HStack>
                <Text fontSize="20px" lineHeight="50px">
                    {pupil.grade} -{' '}
                </Text>
                <LanguageTagList languages={pupil.languages} />
                <Text fontSize="20px" lineHeight="50px">
                    {' '}
                    -{' '}
                </Text>
                <SubjectTagList subjects={pupil.subjectsFormatted} />
            </HStack>
            {!pupil.active && <InfoCard icon="loki" title={t('screening.account_deactivated')} message={t('screening.account_deactivated_details')} />}
            {!screeningToEdit && (
                <>
                    {!needsScreening && <InfoCard icon="loki" title={t('screening.no_open_screening')} message={t('screening.no_open_screening_long')} />}
                    {needsScreening && (
                        <HStack>
                            <Button
                                onPress={async () => {
                                    await createScreening({ variables: { pupilId: pupil.id } });
                                    refresh();
                                }}
                            >
                                Screening anlegen
                            </Button>
                        </HStack>
                    )}
                </>
            )}
            {screeningToEdit && <EditScreening pupil={pupil} screening={screeningToEdit} />}
            {screeningToEdit && <ScreeningSuggestionCard userID={`pupil/${pupil.id}`} />}
            <PupilHistory pupil={pupil} previousScreenings={previousScreenings} />
        </VStack>
    );
}
