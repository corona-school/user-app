import { Button, HStack, Heading, Text, TextArea, VStack, useTheme } from 'native-base';
import { StudentForScreening } from '../../types';
import { InfoCard } from '../../components/InfoCard';
import { LanguageTagList } from '../../components/LanguageTag';
import { SubjectTagList } from '../../components/SubjectTag';
import { useTranslation } from 'react-i18next';
import { useRoles } from '../../hooks/useApollo';
import { gql } from '../../gql';
import { useMutation } from '@apollo/client';
import { MatchPupilCard } from '../matching/MatchPupilCard';
import { InstructorScreeningCard } from './InstructorScreeningCard';
import { TutorScreeningCard } from './TutorScreeningCard';
import { SubcourseCard } from '../course/SubCourseCard';
import { useState } from 'react';
import { Modal } from 'native-base';
import { JobStatusSelector } from './JobStatusSelector';
import { Screening_Jobstatus_Enum } from '../../gql/graphql';
import { TextInputWithSuggestions } from '../../components/TextInputWithSuggestions';

type ScreeningInput = { success: boolean; comment: string; jobStatus: Screening_Jobstatus_Enum; knowsFrom: string };

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

    const { space } = useTheme();

    function doScreen(success: boolean) {
        screen({ success, comment, jobStatus, knowsFrom });
    }

    return (
        <Modal isOpen={open} onClose={onClose} backgroundColor="white" width="90%" height="90%" maxWidth="900px" marginX="auto" top="5%" borderRadius="20px">
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

                <TextInputWithSuggestions
                    value={knowsFrom}
                    setValue={setKnowsFrom}
                    suggestions={[
                        'Persönliche Empfehlung/Freund:innen',
                        'Ehrenamtsbörse',
                        'Instagram',
                        'LinkedIn',
                        'Suchmaschine',
                        'Print (Flyer, Poster,…)',
                        'Presse',
                        'Stipendium',
                        'Unternehmenskooperation',
                        'Universität',
                        'Von Schüler:in zu Helfer:in',
                    ]}
                />
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

    const [openScreenAsTutor, setScreenAsTutor] = useState(false);
    const [openScreenAsInstructor, setScreenAsInstructor] = useState(false);

    const [createLoginToken, { loading: loadingLoginToken, data: loginTokenResult }] = useMutation(
        gql(`
            mutation AdminAccessHelper($userId: String!) { tokenCreateAdmin(userId: $userId) }
        `)
    );

    const [_screenAsInstructor, { loading: loadingInstructorScreening }] = useMutation(
        gql(`
            mutation ScreenAsInstructor($studentId: Float!, $success: Boolean!, $comment: String!) {
                studentInstructorScreeningCreate(studentId: $studentId, screening: {
                    success: $success
                    comment: $comment
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
            mutation ScreenAsTutor($studentId: Float!, $success: Boolean!, $comment: String!) {
                studentTutorScreeningCreate(studentId: $studentId, screening: {
                    success: $success
                    comment: $comment
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

    return (
        <VStack paddingTop="20px" space={space['2']}>
            <Heading fontSize="30px">
                Helfer:in / {student.firstname} {student.lastname}
            </Heading>
            <HStack>
                <LanguageTagList languages={student.languages} />
                <Text fontSize="20px" lineHeight="50px">
                    {' '}
                    -{' '}
                </Text>
                <SubjectTagList subjects={student.subjectsFormatted} />
            </HStack>

            {myRoles.includes('TRUSTED_SCREENER') && student.active && (
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
                title="Als Kursleiter screenen"
            />

            <CreateScreeningModal
                loading={loadingTutorScreening}
                onClose={() => setScreenAsTutor(false)}
                open={openScreenAsTutor}
                screen={screenAsTutor}
                student={student}
                title="Für 1:1 screenen"
            />

            {!student.active && <InfoCard icon="loki" title={t('screening.account_deactivated')} message={t('screening.account_deactivated_details')} />}

            <Heading fontSize="20px">Vorherige Screenings</Heading>
            {student.tutorScreenings?.map((tutorScreening) => (
                <TutorScreeningCard screening={tutorScreening} />
            ))}
            {student.instructorScreenings?.map((instructorScreening) => (
                <InstructorScreeningCard screening={instructorScreening} />
            ))}

            {student.matches.length > 0 && (
                <>
                    <Heading fontSize="20px">Matches</Heading>
                    <HStack space={space['1']} display="flex" flexWrap="wrap">
                        {student.matches.map((match) => (
                            <MatchPupilCard match={match} />
                        ))}
                    </HStack>
                </>
            )}

            {student.subcoursesInstructing.length > 0 && (
                <>
                    <Heading fontSize="20px">Kurse</Heading>
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
