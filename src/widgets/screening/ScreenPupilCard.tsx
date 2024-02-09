import { useMutation } from '@apollo/client';
import { Button, ChevronRightIcon, Heading, HStack, Modal, Radio, Stack, Text, TextArea, useTheme, VStack } from 'native-base';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { InfoCard } from '../../components/InfoCard';
import { LanguageTagList } from '../../components/LanguageTag';
import { SubjectTagList } from '../../components/SubjectTag';
import { gql } from '../../gql';
import { PupilScreeningStatus, Pupil_Languages_Enum, Pupil_Screening_Status_Enum, Subject } from '../../gql/graphql';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { PupilForScreening, PupilScreening } from '../../types';
import { MatchStudentCard } from '../matching/MatchStudentCard';
import { PupilScreeningCard } from './PupilScreeningCard';
import { ScreeningSuggestionCard } from './ScreeningSuggestionCard';
import { useUser, useRoles } from '../../hooks/useApollo';
import { SubjectSelector } from '../SubjectSelector';
import { EditSubjectsModal } from './EditSubjectsModal';
import EditIcon from '../../assets/icons/lernfair/lf-edit.svg';
import { EditGradeModal } from './EditGradeModal';
import { EditLanguagesModal } from './EditLanguagesModal';

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

    const [missedScreening, { loading: loadingMissedScreening, data: missedScreeningResult }] = useMutation(
        gql(
            `mutation MissedScreening($pupilScreeningId: Float!, $comment: String!) { pupilMissedScreening(pupilScreeningId: $pupilScreeningId, comment: $comment) }`
        )
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

    function missed() {
        const resultComment = `${screeningComment || ''}[${screener.firstname} ${screener.lastname}]: Screening verpasst\n\n`;
        missedScreening({
            variables: { pupilScreeningId: screening!.id!, comment: resultComment },
        });
        setScreeningComment(resultComment);
    }

    function suggest(positive?: boolean) {
        let resultComment = screeningComment;

        if (positive === true) {
            resultComment += `[${screener.firstname} ${screener.lastname}]: Annahme empfehlen\n\n`;
        }

        if (positive === false) {
            resultComment += `[${screener.firstname} ${screener.lastname}]: Ablehnung empfehlen\n\n`;
        }

        storeEdit({
            variables: {
                id: screening!.id!,
                screeningComment: resultComment,
                status: PupilScreeningStatus.Dispute,
            },
        });
        setScreeningComment(resultComment);
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
                    {(loading || loadingDeactivation || loadingMissedScreening) && <CenterLoadingSpinner />}
                    {(data || missedScreeningResult) && <InfoCard icon="yes" title="" message={t('screening.screening_saved')} />}
                    {deactivateResult && <InfoCard icon="no" title={t('screening.account_deactivated')} message="" />}
                    {!loading && !loadingDeactivation && !loadingMissedScreening && !data && !deactivateResult && !missedScreeningResult && (
                        <>
                            <Button onPress={() => suggest()} variant={isDispute ? 'outline' : 'solid'}>
                                {t('screening.save')}
                            </Button>
                            <Button onPress={() => suggest(true)} variant={isDispute ? 'outline' : 'solid'}>
                                {t('screening.recommend_acceptance')}
                            </Button>
                            <Button onPress={() => suggest(false)} variant={isDispute ? 'outline' : 'solid'}>
                                {t('screening.recommend_rejection')}
                            </Button>
                            <Button onPress={() => missed()} variant="outline">
                                {t('screening.missed')}
                            </Button>
                        </>
                    )}
                </HStack>
                <HStack space={space['1']} display="flex">
                    {!loading && !loadingDeactivation && !loadingMissedScreening && !data && !deactivateResult && !missedScreeningResult && (
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
                                text={t('screening.confirm_rejection', {
                                    firstname: pupil.firstname,
                                    lastname: pupil.lastname,
                                })}
                            />
                            <ConfirmModal
                                isOpen={confirmSuccess}
                                onClose={() => setConfirmSuccess(false)}
                                onConfirmed={success}
                                text={t('screening.confirm_success', {
                                    firstname: pupil.firstname,
                                    lastname: pupil.lastname,
                                })}
                            />
                            <ConfirmModal
                                danger
                                isOpen={confirmDeactivation}
                                onClose={() => setConfirmDeactivation(false)}
                                onConfirmed={deactivate}
                                text={t('screening.confirm_deactivate', {
                                    firstname: pupil.firstname,
                                    lastname: pupil.lastname,
                                })}
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

const UPDATE_SUBJECTS_QUERY = gql(`
mutation PupilUpdateSubjects($pupilId: Float!, $data: PupilUpdateSubjectsInput!) { pupilUpdateSubjects(pupilId: $pupilId, data: $data) }
`);

const UPDATE_GRADE_QUERY = gql(`
    mutation PupilUpdateGrade($pupilId: Float!, $gradeAsInt: Int!) { pupilUpdate(pupilId: $pupilId, data: { gradeAsInt: $gradeAsInt }) }
`);

const UPDATE_LANGUAGES_QUERY = gql(`
    mutation PupilUpdateLanguages($pupilId: Float!, $languages: [Language!]) { pupilUpdate(pupilId: $pupilId, data: { languages: $languages }) }
`);

export function ScreenPupilCard({ pupil, refresh }: { pupil: PupilForScreening; refresh: () => void }) {
    const { space } = useTheme();
    const { t } = useTranslation();
    const myRoles = useRoles();

    const [createScreening] = useMutation(gql(`mutation CreateScreening($pupilId: Float!) { pupilCreateScreening(pupilId: $pupilId) }`));

    const [confirmDeactivation, setConfirmDeactivation] = useState(false);
    const [deactivateAccount, { loading: loadingDeactivation, data: deactivateResult }] = useMutation(
        gql(`
            mutation ScreenerDeactivatePupil($pupilId: Float!) { pupilDeactivate(pupilId: $pupilId) }
        `)
    );

    const [createLoginToken] = useMutation(
        gql(`
            mutation AdminAccess($userId: String!) { tokenCreateAdmin(userId: $userId) }
        `)
    );

    const [showEditSubjects, setShowEditSubjects] = useState(false);
    const [showEditLanguages, setShowEditLanguages] = useState(false);
    const [showEditGrade, setShowEditGrade] = useState(false);

    const [mutationUpdateSubjects, {}] = useMutation(UPDATE_SUBJECTS_QUERY);

    const [mutationUpdateGrade, {}] = useMutation(UPDATE_GRADE_QUERY);

    const [mutationUpdateLanguages, {}] = useMutation(UPDATE_LANGUAGES_QUERY);

    function updateSubjects(newSubjects: Subject[]) {
        mutationUpdateSubjects({
            variables: {
                pupilId: pupil!.id,
                data: { subjects: newSubjects.map((it) => ({ name: it.name, mandatory: it.mandatory })) },
            },
        }).then(refresh);
    }

    function updateGrade(grade: number) {
        mutationUpdateGrade({
            variables: {
                pupilId: pupil.id,
                gradeAsInt: grade,
            },
        }).then(refresh);
    }

    function updateLanguages(languages: Pupil_Languages_Enum[]) {
        mutationUpdateLanguages({
            variables: {
                pupilId: pupil.id,
                languages: languages as any,
            },
        }).then(refresh);
    }

    function deactivate() {
        setConfirmDeactivation(false);
        deactivateAccount({ variables: { pupilId: pupil!.id! } });
        refresh();
    }

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

    const impersonate = async () => {
        // We need to work around the popup blocker of modern browsers, as you can only
        // call window.open(.., '_blank') in a synchronous event handler of onClick,
        // so we open the window before we call any asynchronous functions and later set the URL when we have the data.
        const w = window.open('', '_blank');
        if (w != null) {
            const res = await createLoginToken({ variables: { userId: `pupil/${pupil!.id}` } });
            const token = res?.data?.tokenCreateAdmin;

            w.location.href =
                process.env.NODE_ENV === 'production'
                    ? `https://app.lern-fair.de/login-token?secret_token=${token}&temporary`
                    : `http://localhost:3000/login-token?secret_token=${token}&temporary`;
            w.focus();
        }
    };

    return (
        <VStack paddingTop="20px" space={space['2']}>
            <Heading fontSize="30px">
                {t('pupil')} / {pupil.firstname} {pupil.lastname}
            </Heading>
            <HStack flexWrap="wrap" space={space['1']}>
                <Text fontSize="20px" lineHeight="50px">
                    {pupil.grade} -{' '}
                </Text>
                <Button variant="outline" onPress={() => setShowEditGrade(true)}>
                    <EditIcon />
                </Button>
                <LanguageTagList languages={pupil.languages} />
                <Button variant="outline" onPress={() => setShowEditLanguages(true)}>
                    <EditIcon />
                </Button>
                <Text fontSize="20px" lineHeight="50px">
                    {' '}
                    -{' '}
                </Text>
                <Stack direction="row" space={space['1']}>
                    <SubjectTagList subjects={pupil.subjectsFormatted} />
                    <Button variant="outline" onPress={() => setShowEditSubjects(true)}>
                        <EditIcon />
                    </Button>
                </Stack>
            </HStack>
            {myRoles.includes('TRUSTED_SCREENER') && pupil.active && (
                <HStack space={space['1']}>
                    <Button
                        onPress={async () => {
                            await impersonate();
                        }}
                    >
                        Als Nutzer anmelden
                    </Button>
                </HStack>
            )}
            {showEditSubjects && <EditSubjectsModal onClose={() => setShowEditSubjects(false)} subjects={pupil.subjectsFormatted} store={updateSubjects} />}
            {showEditGrade && <EditGradeModal grade={pupil.gradeAsInt} store={updateGrade} onClose={() => setShowEditGrade(false)} />}
            {showEditLanguages && <EditLanguagesModal languages={pupil.languages} store={updateLanguages} onClose={() => setShowEditLanguages(false)} />}

            {!pupil.active && <InfoCard icon="loki" title={t('screening.account_deactivated')} message={t('screening.account_deactivated_details')} />}
            {!screeningToEdit && (
                <>
                    {!needsScreening && <InfoCard icon="loki" title={t('screening.no_open_screening')} message={t('screening.no_open_screening_long')} />}
                    {needsScreening && (
                        <HStack space={space['1']}>
                            <Button
                                onPress={async () => {
                                    await createScreening({ variables: { pupilId: pupil.id } });
                                    refresh();
                                }}
                            >
                                Screening anlegen
                            </Button>
                            {pupil.active && !loadingDeactivation && !deactivateResult && (
                                <>
                                    <Button onPress={() => setConfirmDeactivation(true)} variant="outline" borderColor="orange.900">
                                        {t('screening.deactivate')}
                                    </Button>
                                    <ConfirmModal
                                        danger
                                        isOpen={confirmDeactivation}
                                        onClose={() => setConfirmDeactivation(false)}
                                        onConfirmed={deactivate}
                                        text={t('screening.confirm_deactivate', {
                                            firstname: pupil.firstname,
                                            lastname: pupil.lastname,
                                        })}
                                    />
                                </>
                            )}
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
