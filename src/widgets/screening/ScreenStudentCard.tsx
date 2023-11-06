import { Button, HStack, Heading, Text, VStack, useTheme } from 'native-base';
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
import GroupTile from '../GroupTile';
import { SubcourseCard } from '../course/SubCourseCard';

export function ScreenStudentCard({ student }: { student: StudentForScreening }) {
    const { space } = useTheme();
    const { t } = useTranslation();
    const myRoles = useRoles();

    const [createLoginToken, { loading: loadingLoginToken, data: loginTokenResult }] = useMutation(
        gql(`
            mutation AdminAccessHelper($userId: String!) { tokenCreateAdmin(userId: $userId) }
        `)
    );

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
