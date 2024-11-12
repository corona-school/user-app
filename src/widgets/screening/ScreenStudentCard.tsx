import { Button, Divider, HStack, Heading, Text, TextArea, VStack, useTheme, Select, Input } from 'native-base';
import { InstructorScreening, StudentForScreening, TutorScreening } from '../../types';
import { InfoCard } from '../../components/InfoCard';
import { LanguageTagList } from '../../components/LanguageTag';
import { SubjectTagList } from '../../components/SubjectTag';
import { useTranslation } from 'react-i18next';
import { useRoles } from '../../hooks/useApollo';
import { gql } from '../../gql';
import { useMutation } from '@apollo/client';
import { MatchPupilCard } from '../matching/MatchPupilCard';
import { StudentScreeningCard } from './StudentScreeningCard';
import { SubcourseCard } from '../course/SubcourseCard';
import { useState, useEffect } from 'react';
import { Modal } from 'native-base';
import { JobStatusSelector } from './JobStatusSelector';
import { Screening_Jobstatus_Enum } from '../../gql/graphql';
import { formatDate } from '../../Utility';
import EditIcon from '../../assets/icons/lernfair/lf-edit.svg';
import { EditLanguagesModal } from './EditLanguagesModal';

type ScreeningInput = { success: boolean; comment: string; jobStatus: Screening_Jobstatus_Enum; knowsFrom: string };

const knowsFromSuggestions = [
    'Persönliche Empfehlung/Freund:innen',
    'Ehrenamtsbörse',
    'Instagram',
    'Tafel',
    'LinkedIn',
    'Suchmaschine',
    'Jugendzentrum',
    'Print (Flyer, Poster,…)',
    'Presse',
    'Stipendium',
    'Unternehmenskooperation',
    'Universität',
    'Von Schüler:in zu Helfer:in',
    'Sonstiges',
];

function CreateScreeningModal({
    student,
    title,
    screen,
    open,
    onClose,
    loading,
}: {
    student: StudentForScreening;
    title: string;
    screen: (screening: ScreeningInput) => void;
    open: boolean;
    onClose: () => void;
    loading: boolean;
}) {
    const [comment, setComment] = useState('');
    const [jobStatus, setJobStatus] = useState<Screening_Jobstatus_Enum>(Screening_Jobstatus_Enum.Misc);
    const [knowsFrom, setKnowsFrom] = useState('');
    const [customKnowsFrom, setCustomKnowsFrom] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { space } = useTheme();

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

    function doScreen(success: boolean) {
        const finalKnowsFrom = knowsFrom === 'Sonstiges' ? customKnowsFrom : knowsFrom;
        screen({ success, comment, jobStatus, knowsFrom: finalKnowsFrom });
    }

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            backgroundColor="white"
            width="90%"
            height="90%"
            maxWidth="900px"
            marginX="auto"
            top="5%"
            borderRadius="20px"
            overflowY="scroll"
        >
            <VStack height="90%" paddingTop="5%" textAlign="left" width="90%" display="flex">
                <Heading>{title}</Heading>
                <Heading paddingTop="20px" fontSize="15px">
                    Kommentar:
                </Heading>
                <TextArea autoCompleteType="" numberOfLines={30} minH="300px" value={comment} onChangeText={setComment} />

                <Heading paddingTop="20px" fontSize="15px">
                    Beruflicher Status:
                </Heading>
                <JobStatusSelector value={jobStatus} setValue={setJobStatus} />

                <Heading paddingTop="20px" fontSize="15px">
                    Kennt Lern-Fair durch:
                </Heading>

                <Select selectedValue={knowsFrom} onValueChange={(value: string) => handleOnKnowsFromChanges(value)} placeholder="Bitte wähle eine Antwort aus">
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

                <HStack space={space['1']} paddingTop={space['1']}>
                    <Button isLoading={loading} onPress={() => doScreen(true)}>
                        Screening erfolgreich
                    </Button>
                    <Button isLoading={loading} onPress={() => doScreen(false)} borderColor="red.400" variant="outline">
                        Ablehnen
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    );
}

export function ScreenStudentCard({ student, refresh }: { student: StudentForScreening; refresh: () => void }) {
    const { space } = useTheme();
    const { t } = useTranslation();
    const myRoles = useRoles();
    const { colors } = useTheme();

    const [languageError, setLanguageError] = useState('');
    const [subjectError, setSubjectError] = useState('');

    useEffect(() => {
        if (!student.languages || student.languages.length === 0) {
            setLanguageError(t('screening.errors.language_missing'));
        } else {
            setLanguageError('');
        }
        if (!student.subjectsFormatted || student.subjectsFormatted.length === 0) {
            setSubjectError(t('screening.errors.subjects_missing'));
        } else {
            setSubjectError('');
        }
    }, [student, t]);

    const [openScreenAsTutor, setScreenAsTutor] = useState(false);
    const [openScreenAsInstructor, setScreenAsInstructor] = useState(false);

    const [createLoginToken] = useMutation(
        gql(`
            mutation AdminAccessHelper($userId: String!) { tokenCreateAdmin(userId: $userId) }
        `)
    );

    const [updateTutorScreening] = useMutation(
        gql(`
            mutation UpdateTutorScreening($screeningId: Float!, $comment: String) {
                studentTutorScreeningUpdate(screeningId: $screeningId, data: { comment: $comment })
            }
        `)
    );

    const [updateInstructorScreening] = useMutation(
        gql(`
            mutation UpdateInstructorScreening($screeningId: Float!, $comment: String) {
                studentInstructorScreeningUpdate(screeningId: $screeningId, data: { comment: $comment })
            }
        `)
    );

    const [_screenAsInstructor, { loading: loadingInstructorScreening }] = useMutation(
        gql(`
            mutation ScreenAsInstructor($studentId: Float!, $success: Boolean!, $comment: String! $knowsFrom: String!, $jobStatus: screening_jobstatus_enum!) {
                studentInstructorScreeningCreate(studentId: $studentId, screening: {
                    success: $success
                    comment: $comment
                    jobStatus: $jobStatus
                    knowsCoronaSchoolFrom: $knowsFrom
                })
            }
        `)
    );

    async function screenAsInstructor(screening: ScreeningInput) {
        await _screenAsInstructor({ variables: { studentId: student.id, ...screening } });
        refresh();
        setScreenAsInstructor(false);
    }

    const [_screenAsTutor, { loading: loadingTutorScreening }] = useMutation(
        gql(`
            mutation ScreenAsTutor($studentId: Float!, $success: Boolean!, $comment: String!, $knowsFrom: String!, $jobStatus: screening_jobstatus_enum!) {
                studentTutorScreeningCreate(studentId: $studentId, screening: {
                    success: $success
                    comment: $comment
                    jobStatus: $jobStatus
                    knowsCoronaSchoolFrom: $knowsFrom
                })
            }
        `)
    );

    async function screenAsTutor(screening: ScreeningInput) {
        await _screenAsTutor({ variables: { studentId: student.id, ...screening } });
        refresh();
        setScreenAsTutor(false);
    }

    const impersonate = async () => {
        // We need to work around the popup blocker of modern browsers, as you can only
        // call window.open(.., '_blank') in a synchronous event handler of onClick,
        // so we open the window before we call any asynchronous functions and later set the URL when we have the data.
        const w = window.open('', '_blank');
        if (w != null) {
            const res = await createLoginToken({ variables: { userId: `student/${student!.id}` } });
            const token = res?.data?.tokenCreateAdmin;

            w.location.href =
                process.env.NODE_ENV === 'production'
                    ? `https://app.lern-fair.de/login-token?secret_token=${token}&temporary`
                    : `http://localhost:3000/login-token?secret_token=${token}&temporary`;
            w.focus();
        }
    };

    const isTutor = student.tutorScreenings?.some((it) => it.success) ?? false;
    const isInstructor = student.instructorScreenings?.some((it) => it.success) ?? false;

    const handleOnUpdateInstructorScreening = async (screeningId: number, updatedData: Pick<InstructorScreening, 'comment'>) => {
        await updateInstructorScreening({ variables: { screeningId, comment: updatedData.comment } });
        refresh();
    };

    const handleOnUpdateTutorScreening = async (screeningId: number, updatedData: Pick<TutorScreening, 'comment'>) => {
        await updateTutorScreening({ variables: { screeningId, comment: updatedData.comment } });
        refresh();
    };

    const [showEditSubjects, setShowEditSubjects] = useState(false);
    const [showEditLanguages, setShowEditLanguages] = useState(false);

    return (
        <VStack paddingTop="20px" space={space['2']}>
            <Heading fontSize="30px">
                {t('helper')} / {student.firstname} {student.lastname}
            </Heading>
            <VStack space={space['2']}>
                <LanguageTagList languages={student.languages} />

                <Button variant="outline" onPress={() => setShowEditLanguages(true)} rightIcon={<EditIcon />}>
                    Sprachen bearbeiten
                </Button>

                {languageError && <Text color={colors.error[500]}>{languageError}</Text>}

                <Divider my="1" />

                <SubjectTagList subjects={student.subjectsFormatted} />

                <Button variant="outline" onPress={() => setShowEditSubjects(true)} rightIcon={<EditIcon />}>
                    Fächer bearbeiten
                </Button>

                {subjectError && <Text color={colors.error[500]}>{subjectError}</Text>}
            </VStack>

            <Divider my="1" />

            <VStack>
                <Heading fontSize="20px">{t('screening.certificateOfConduct')}</Heading>
                <Text fontSize="15px" lineHeight="50px">
                    {t(student.certificateOfConduct?.id ? 'screening.certificateOfConductWasProvided' : 'screening.certificateOfConductWasNotProvided')}
                </Text>
                {student.certificateOfConductDeactivationDate && (
                    <Text fontSize="15px" lineHeight="50px" color={student.certificateOfConductDeactivationDate ? 'danger.500' : 'primary.900'}>
                        {t('screening.deactivationDate')}: {formatDate(student.certificateOfConductDeactivationDate)}
                    </Text>
                )}
            </VStack>

            {myRoles.includes('TRUSTED_SCREENER') && student.active && (
                <HStack space={space['1']}>
                    <Button
                        onPress={async () => {
                            await impersonate();
                        }}
                    >
                        {t('screening.login_as_user')}
                    </Button>
                </HStack>
            )}

            <HStack space={space['1']}>
                {!isTutor && <Button onPress={() => setScreenAsTutor(true)}>Für 1:1 screenen</Button>}
                {!isInstructor && <Button onPress={() => setScreenAsInstructor(true)}>Für Kurse screenen</Button>}
            </HStack>

            <CreateScreeningModal
                loading={loadingInstructorScreening}
                onClose={() => setScreenAsInstructor(false)}
                open={openScreenAsInstructor}
                screen={screenAsInstructor}
                student={student}
                title={t('screening.screen_as_instructor')}
            />

            <CreateScreeningModal
                loading={loadingTutorScreening}
                onClose={() => setScreenAsTutor(false)}
                open={openScreenAsTutor}
                screen={screenAsTutor}
                student={student}
                title={t('screening.screen_as_tutor')}
            />

            {!student.active && <InfoCard icon="loki" title={t('screening.account_deactivated')} message={t('screening.account_deactivated_details')} />}

            {((student.tutorScreenings?.length ?? 0) > 0 || (student.instructorScreenings?.length ?? 0) > 0) && (
                <Heading fontSize="20px">{t('screening.previous_screenings')}</Heading>
            )}
            {student.tutorScreenings?.map((tutorScreening) => (
                <StudentScreeningCard screeningType="tutor" onUpdate={handleOnUpdateTutorScreening} screening={tutorScreening} />
            ))}
            {student.instructorScreenings?.map((instructorScreening) => (
                <StudentScreeningCard screeningType="instructor" onUpdate={handleOnUpdateInstructorScreening} screening={instructorScreening} />
            ))}

            {student.matches.length > 0 && (
                <>
                    <Heading fontSize="20px">{t('screening.matches')}</Heading>
                    <HStack space={space['1']} display="flex" flexWrap="wrap">
                        {student.matches.map((match) => (
                            <MatchPupilCard match={match} />
                        ))}
                    </HStack>
                </>
            )}

            {student.subcoursesInstructing.length > 0 && (
                <>
                    <Heading fontSize="20px">{t('screening.their_courses')}</Heading>
                    <VStack space={space['1']} display="flex" flexWrap="wrap">
                        {student.subcoursesInstructing.map((subcourse) => (
                            <SubcourseCard subcourse={subcourse} />
                        ))}
                    </VStack>
                </>
            )}
        </VStack>
    );
}
