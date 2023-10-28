import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { DateTime } from 'luxon';
import { Box, Stack, Text, useTheme, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs, { Tab } from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import PupilCourseButtons from './single-course/PupilCourseButtons';
import SubcourseData from '../subcourse/SubcourseData';
import { useMemo } from 'react';
import ParticipantRow from '../subcourse/ParticipantRow';
import PupilJoinedCourseBanner from '../../widgets/PupilJoinedCourseBanner';
import { getTrafficStatus } from '../../Utility';
import AppointmentList from '../../widgets/AppointmentList';
import { Appointment } from '../../types/lernfair/Appointment';
import HelpNavigation from '../../components/HelpNavigation';
import { Subcourse } from '../../gql/graphql';
import { Lecture } from '../../gql/graphql';

function OtherParticipants({ subcourseId }: { subcourseId: number }) {
    const { t } = useTranslation();
    const { data, loading } = useQuery(
        gql(`
        query GetOtherParticipants($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId){
                otherParticipants{
                    id
                    firstname
                    grade
                }
            }

            me { pupil { firstname lastname schooltype grade }}
        }
    `),
        { variables: { subcourseId } }
    );

    if (loading || !data) return <CenterLoadingSpinner />;

    const otherParticipants = data.subcourse!.otherParticipants;

    if (otherParticipants.length === 0) return <Text>{t('single.global.noMembers')}</Text>;

    return (
        <>
            <ParticipantRow participant={data.me.pupil as any} />
            {otherParticipants.map((participant) => (
                <ParticipantRow participant={participant} />
            ))}
        </>
    );
}

const singleSubcoursePupilQuery = gql(`
query GetSingleSubcoursePupil($subcourseId: Int!) {
    subcourse(subcourseId: $subcourseId){
        id
        participantsCount
        maxParticipants
        minGrade
        maxGrade
        capacity
        groupChatType
        allowChatContactProspects
        allowChatContactParticipants
        nextLecture{
            start
            duration
        }
        instructors{
            id
            firstname
            lastname
        }
        course {
            id
            courseState
            name
            image
            category
            description
            subject
            tags{
            name
            }
            allowContact
        }
        lectures{
            start
            duration
        }
        canJoin { allowed reason }
        canContactInstructor { allowed reason }
        canJoinWaitinglist { allowed reason }
        isParticipant
        isOnWaitingList
        cancelled
        published
        appointments {
              id
              appointmentType
              title
              description
              start
              duration
              displayName
              position
              total
              isOrganizer
              isParticipant
              subcourse {
                published
              }
            }
    }
}
`);

const SingleCoursePupil = () => {
    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);
    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const toast = useToast();

    const { data, loading, refetch } = useQuery(singleSubcoursePupilQuery, {
        variables: {
            subcourseId,
        },
    });

    const { subcourse } = data ?? {};

    const { course } = subcourse ?? {};

    const isInPast = useMemo(
        () =>
            !subcourse ||
            subcourse.lectures.every((lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis()),
        [subcourse]
    );

    const tabs: Tab[] = [
        {
            title: t('single.tabs.lessons'),
            content: (
                <Box minH={300}>
                    <AppointmentList
                        isReadOnlyList={!subcourse?.isParticipant}
                        disableScroll
                        appointments={data?.subcourse?.appointments as Appointment[]}
                        noOldAppointments
                    />
                </Box>
            ),
        },
        {
            title: t('single.tabs.description'),
            content: (
                <>
                    <Text maxWidth={sizes['imageHeaderWidth']} marginBottom={space['1']}>
                        {course?.description}
                    </Text>
                </>
            ),
        },
    ];

    if (subcourse?.isParticipant) {
        tabs.push({
            title: t('single.tabs.participant'),
            content: (
                <>
                    <OtherParticipants subcourseId={subcourseId} />
                </>
            ),
        });
    }

    return (
        <WithNavigation
            headerTitle={course?.name.substring(0, 20)}
            showBack
            isLoading={loading}
            headerLeft={
                <Stack alignItems="center" direction="row">
                    <HelpNavigation />
                    <NotificationAlert />
                </Stack>
            }
        >
            <Stack space={space['2']} paddingX={space['1.5']}>
                {course && subcourse && <SubcourseData course={course} subcourse={subcourse} isInPast={isInPast} />}
                {subcourse?.isParticipant && !isInPast && (
                    <PupilJoinedCourseBanner
                        courseStatus={getTrafficStatus(subcourse?.participantsCount, subcourse?.maxParticipants)}
                        seatsLeft={subcourse?.maxParticipants - subcourse?.participantsCount}
                    />
                )}

                {course && subcourse && !isInPast && <PupilCourseButtons subcourse={subcourse} refresh={refetch} />}
                <Tabs tabs={tabs} />
            </Stack>
        </WithNavigation>
    );
};

export default SingleCoursePupil;
