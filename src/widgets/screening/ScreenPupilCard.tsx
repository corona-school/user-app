import { ApolloError, useMutation } from '@apollo/client';
import { Button, FormControl, Divider, Heading, HStack, Text, TextArea, useTheme, useToast, VStack, Select, Input } from 'native-base';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { InfoCard } from '../../components/InfoCard';
import { LanguageTagList } from '../../components/LanguageTag';
import { SubjectTagList } from '../../components/SubjectTag';
import { gql } from '../../gql';
import { PupilScreeningStatus, Pupil_Languages_Enum, Pupil_Screening_Status_Enum } from '../../gql/graphql';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { PupilForScreening, PupilScreening } from '../../types';
import { MatchStudentCard } from '../matching/MatchStudentCard';
import { PupilScreeningCard } from './PupilScreeningCard';
import { ScreeningSuggestionCard } from './ScreeningSuggestionCard';
import { useUser, useRoles } from '../../hooks/useApollo';
import { EditSubjectsModal } from './EditSubjectsModal';
import EditIcon from '../../assets/icons/lernfair/lf-edit.svg';
import { EditGradeModal } from './EditGradeModal';
import { EditLanguagesModal } from './EditLanguagesModal';
import DisableableButton from '../../components/DisablebleButton';
import { getGradeLabel } from '../../Utility';

const MISSED_SCREENING_QUERY = gql(
    `mutation MissedScreening($pupilScreeningId: Float!, $comment: String!) { pupilMissedScreening(pupilScreeningId: $pupilScreeningId, comment: $comment) }`
);

const DEACTIVATE_ACCOUNT_QUERY = gql(`
mutation ScreenerDeactivatePupil($pupilId: Float!) { pupilDeactivate(pupilId: $pupilId) }
`);

const UPDATE_SCREENING_QUERY = gql(`
mutation UpdateScreening($id: Float!, $screeningComment: String!, $status: PupilScreeningStatus, $knowsFrom: String!) {
    pupilUpdateScreening(pupilScreeningId: $id, data: {
        comment: $screeningComment,
        status: $status
        knowsCoronaSchoolFrom: $knowsFrom
    })
}
`);

const knowsFromSuggestions = [
    'Persönliche Empfehlung: Familie & Freunde',
    'Jugendzentrum',
    'Tafel',
    'Schule / Lehrkraft',
    'TikTok',
    'Instagram',
    'Print (Flyer, Poster etc.)',
    'Suchmaschine (Google)',
    'Website',
    'Sonstiges',
];

function EditScreening({ pupil, screening }: { pupil: PupilForScreening; screening: PupilScreening }) {
    const isDispute = screening!.status! === Pupil_Screening_Status_Enum.Dispute;
    const screener = useUser();

    const { space } = useTheme();
    const { t } = useTranslation();

    const [screeningComment, setScreeningComment] = useState(screening!.comment!);
    const [knowsFrom, setKnowsFrom] = useState(screening.knowsCoronaSchoolFrom ?? '');
    const [customKnowsFrom, setCustomKnowsFrom] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [confirmRejection, setConfirmRejection] = useState(false);
    const [confirmSuccess, setConfirmSuccess] = useState(false);
    const [confirmDeactivation, setConfirmDeactivation] = useState(false);

    const [storeEdit, { loading, data }] = useMutation(UPDATE_SCREENING_QUERY);
    const [deactivateAccount, { loading: loadingDeactivation, data: deactivateResult }] = useMutation(DEACTIVATE_ACCOUNT_QUERY);
    const [missedScreening, { loading: loadingMissedScreening, data: missedScreeningResult }] = useMutation(MISSED_SCREENING_QUERY);

    // For privacy, we deliberately clear the comment field when storing the final decision:

    function rejection() {
        setConfirmRejection(false);
        storeEdit({ variables: { id: screening!.id!, screeningComment: '', status: PupilScreeningStatus.Rejection, knowsFrom } });
    }

    async function success() {
        setConfirmSuccess(false);
        storeEdit({ variables: { id: screening!.id!, screeningComment: '', status: PupilScreeningStatus.Success, knowsFrom } });
    }

    function deactivate() {
        setConfirmDeactivation(false);
        storeEdit({ variables: { id: screening!.id!, screeningComment: '', status: PupilScreeningStatus.Rejection, knowsFrom } });
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

        let knowsFromValue = knowsFrom;
        if (knowsFrom === 'Sonstiges') {
            knowsFromValue = customKnowsFrom;
        }

        storeEdit({
            variables: {
                id: screening!.id!,
                screeningComment: resultComment,
                status: PupilScreeningStatus.Dispute,
                knowsFrom: knowsFromValue,
            },
        });
        setScreeningComment(resultComment);
    }

    const handleOnKnowsFromChanges = (value: string) => {
        setKnowsFrom(value);
    };

    const handleOnCustomKnowsFromChanges = (value: string) => {
        let modifiedValue = value;

        if (!modifiedValue.startsWith('Sonstiges: ')) {
            modifiedValue = `Sonstiges: ${modifiedValue}`;
        }

        if (modifiedValue.length > 60) {
            setErrorMessage('Bitte halte deine Antwort kürzer als 60 Zeichen');
        } else {
            setErrorMessage('');
        }

        setCustomKnowsFrom(modifiedValue);
    };

    useEffect(() => {
        const isCustom = !!screening.knowsCoronaSchoolFrom && !knowsFromSuggestions.includes(screening.knowsCoronaSchoolFrom);
        if (isCustom) {
            setKnowsFrom('Sonstiges');
            setCustomKnowsFrom(screening.knowsCoronaSchoolFrom || '');
        }
    }, [screening.knowsCoronaSchoolFrom]);

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
                <FormControl width={['100%', '60%']}>
                    <FormControl.Label>Kennt Lern-Fair durch:</FormControl.Label>
                    <Select
                        selectedValue={knowsFrom}
                        onValueChange={(value: string) => handleOnKnowsFromChanges(value)}
                        placeholder="Bitte wähle eine Antwort aus"
                    >
                        {knowsFromSuggestions.map((option, index) => (
                            <Select.Item key={index} label={option} value={option} />
                        ))}
                    </Select>

                    {knowsFrom === 'Sonstiges' && (
                        <>
                            <Input
                                value={customKnowsFrom}
                                onChangeText={handleOnCustomKnowsFromChanges}
                                placeholder="Bitte gebe hier eine Antwort ein"
                                maxLength={60}
                            />
                            {errorMessage && <Text color="red.500">{errorMessage}</Text>}
                        </>
                    )}
                </FormControl>
                <FormControl>
                    <FormControl.Label>
                        Interner Kommentar{' '}
                        <Text>
                            (Wird <Text underline>nach Entscheidung</Text> gelöscht)
                        </Text>
                    </FormControl.Label>
                    <TextArea value={screeningComment} onChangeText={setScreeningComment} minH="200px" width="100%" autoCompleteType="" />
                </FormControl>
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

const UPDATE_LANGUAGES_QUERY = gql(`
    mutation PupilUpdateLanguages($pupilId: Float!, $languages: [Language!]) { pupilUpdate(pupilId: $pupilId, data: { languages: $languages }) }
`);

const REQUEST_MATCH_QUERY = gql(`
    mutation PupilRequestMatch($pupilId: Float!) { pupilCreateMatchRequest(pupilId: $pupilId) }
`);

const REVOKE_MATCH_REQUEST_QUERY = gql(`
    mutation PupilRevokeMatchRequest($pupilId: Float!) { pupilDeleteMatchRequest(pupilId: $pupilId) }
`);

export function ScreenPupilCard({ pupil, refresh }: { pupil: PupilForScreening; refresh: () => Promise<void> }) {
    const { space } = useTheme();
    const { t } = useTranslation();
    const myRoles = useRoles();
    const toast = useToast();
    const { colors } = useTheme();

    const [languageError, setLanguageError] = useState('');
    const [gradeError, setGradeError] = useState('');
    const [subjectError, setSubjectError] = useState('');

    useEffect(() => {
        if (!pupil.languages || pupil.languages.length === 0) {
            setLanguageError(t('screening.errors.language_missing'));
        } else {
            setLanguageError('');
        }
        if (pupil.grade === null || pupil.grade === undefined) {
            setGradeError(t('screening.errors.grade_missing'));
        } else {
            setGradeError('');
        }
        if (!pupil.subjectsFormatted || pupil.subjectsFormatted.length === 0) {
            setSubjectError(t('screening.errors.subjects_missing'));
        } else {
            setSubjectError('');
        }
    }, [pupil, t]);

    const [createScreening] = useMutation(gql(`mutation CreateScreening($pupilId: Float!) { pupilCreateScreening(pupilId: $pupilId, silent: true) }`));

    const [confirmDeactivation, setConfirmDeactivation] = useState(false);
    const [deactivateAccount, { loading: loadingDeactivation, data: deactivateResult }] = useMutation(DEACTIVATE_ACCOUNT_QUERY);

    const [createLoginToken] = useMutation(
        gql(`
            mutation AdminAccess($userId: String!) { tokenCreateAdmin(userId: $userId) }
        `)
    );

    const [showEditSubjects, setShowEditSubjects] = useState(false);
    const [showEditLanguages, setShowEditLanguages] = useState(false);
    const [showEditGrade, setShowEditGrade] = useState(false);

    const [mutationUpdateLanguages] = useMutation(UPDATE_LANGUAGES_QUERY);
    const [requestMatch, { loading: loadingRequestMatch }] = useMutation(REQUEST_MATCH_QUERY);
    const [revokeMatchRequest, { loading: loadingRevokeMatchRequest }] = useMutation(REVOKE_MATCH_REQUEST_QUERY);

    function updateLanguages(languages: Pupil_Languages_Enum[]) {
        if (languages.length === 0) {
            setLanguageError(t('screening.errors.language_missing'));
        } else {
            setLanguageError('');
        }
        mutationUpdateLanguages({
            variables: {
                pupilId: pupil?.id ?? 0,
                languages: languages as any,
            },
        }).then(() => refresh());
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

    const handleOnCreateScreening = async () => {
        try {
            await createScreening({ variables: { pupilId: pupil.id } });
        } catch (error) {
            toast.show({ description: `${t('error')} ${(error as ApolloError).message}` });
            return;
        }
        refresh();
    };

    const getCanCreateScreening = () => {
        if (!pupil.verifiedAt) {
            return { can: false, reason: `Die E-Mail-Adresse von ${pupil.firstname} ${pupil.lastname} ist noch nicht verifiziert` };
        }
        if (!needsScreening) {
            return { can: false, reason: `${pupil.firstname} ${pupil.lastname} wurde bereits gescreent` };
        }
        if (languageError) {
            return { can: false, reason: languageError };
        }

        if (gradeError) {
            return { can: false, reason: gradeError };
        }

        if (subjectError) {
            return { can: false, reason: subjectError };
        }
        return { can: true, reason: '' };
    };

    const { can: canCreateScreening, reason: canCreateScreeningReason } = getCanCreateScreening();

    return (
        <VStack paddingTop="20px" space={space['2']}>
            <Heading fontSize="30px">
                {t('pupil')} / {pupil.firstname} {pupil.lastname}
            </Heading>
            <VStack space={space['2']}>
                <Text fontSize="20px" lineHeight="50px">
                    {getGradeLabel(pupil.gradeAsInt)}
                </Text>
                <Button variant="outline" onPress={() => setShowEditGrade(true)} rightIcon={<EditIcon />}>
                    Klasse bearbeiten
                </Button>

                {gradeError && <Text color={colors.error[500]}>{gradeError}</Text>}

                <Divider my="1" />

                <LanguageTagList languages={pupil.languages} />
                <Button variant="outline" onPress={() => setShowEditLanguages(true)} rightIcon={<EditIcon />}>
                    Sprachen bearbeiten
                </Button>

                {languageError && <Text color={colors.error[500]}>{languageError}</Text>}

                <Divider my="1" />

                <SubjectTagList subjects={pupil.subjectsFormatted} />
                <Button variant="outline" onPress={() => setShowEditSubjects(true)} rightIcon={<EditIcon />}>
                    Fächer bearbeiten
                </Button>

                {subjectError && <Text color={colors.error[500]}>{subjectError}</Text>}

                <Divider my="1" />
            </VStack>
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
            <EditSubjectsModal
                type="pupil"
                pupilOrStudentId={pupil.id}
                subjects={pupil.subjectsFormatted}
                onOpenChange={setShowEditSubjects}
                isOpen={showEditSubjects}
                onSubjectsUpdated={refresh}
            />
            <EditGradeModal pupilId={pupil.id} grade={pupil.gradeAsInt} onGradeUpdated={refresh} onOpenChange={setShowEditGrade} isOpen={showEditGrade} />
            <EditLanguagesModal
                type="pupil"
                pupilOrStudentId={pupil.id}
                languages={pupil.languages}
                onLanguagesUpdated={refresh}
                onOpenChange={setShowEditLanguages}
                isOpen={showEditLanguages}
            />

            {!pupil.active && <InfoCard icon="loki" title={t('screening.account_deactivated')} message={t('screening.account_deactivated_details')} />}
            {!screeningToEdit && (
                <>
                    {!needsScreening && <InfoCard icon="loki" title={t('screening.no_open_screening')} message={t('screening.no_open_screening_long')} />}
                    <HStack space={space['1']}>
                        <DisableableButton isDisabled={!canCreateScreening} reasonDisabled={canCreateScreeningReason} onPress={handleOnCreateScreening}>
                            Screening anlegen
                        </DisableableButton>
                        {needsScreening && pupil.active && !loadingDeactivation && !deactivateResult && (
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
                </>
            )}
            {screeningToEdit && <EditScreening pupil={pupil} screening={screeningToEdit} />}
            <ScreeningSuggestionCard userID={`pupil/${pupil.id}`} />
            <HStack space={space['1']}>
                {pupil.openMatchRequestCount > 0 && (
                    <VStack padding={space['1']}>
                        <Text bold>{pupil.openMatchRequestCount} Matchanfragen</Text>
                    </VStack>
                )}
                <DisableableButton
                    isDisabled={loadingRequestMatch || (needsScreening && !screeningToEdit)}
                    reasonDisabled="Zuerst muss ein Screening angelegt werden"
                    onPress={() => {
                        requestMatch({ variables: { pupilId: pupil.id } }).then(refresh);
                    }}
                >
                    Match anfragen
                </DisableableButton>
                <DisableableButton
                    variant="outline"
                    isDisabled={loadingRevokeMatchRequest || pupil.openMatchRequestCount === 0}
                    reasonDisabled="Keine offene Matchanfrage"
                    onPress={() => {
                        revokeMatchRequest({ variables: { pupilId: pupil.id } }).then(refresh);
                    }}
                >
                    Anfrage zurücknehmen
                </DisableableButton>
            </HStack>
            <PupilHistory pupil={pupil} previousScreenings={previousScreenings} />
        </VStack>
    );
}
