import { useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import WithNavigation from '../../components/WithNavigation';
import PupilCourseButtons from './single-course/PupilCourseButtons';
import SubcourseData from '../subcourse/SubcourseData';
import { useEffect, useMemo } from 'react';
import ParticipantRow from '../subcourse/ParticipantRow';
import PupilJoinedCourseBanner from '../../widgets/PupilJoinedCourseBanner';
import { getTrafficStatus } from '../../Utility';
import { Appointment } from '../../types/lernfair/Appointment';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';
import { Typography } from '@/components/Typography';
import { AppointmentList } from '@/components/appointment/AppointmentsList';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useBreadcrumbRoutes } from '@/hooks/useBreadcrumb';
import { Course_Category_Enum, Lecture } from '@/gql/graphql';
import { toast } from 'sonner';

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
                    gradeAsInt
                }
            }

            me { pupil { firstname lastname schooltype grade, gradeAsInt }}
        }
    `),
        { variables: { subcourseId } }
    );

    if (loading || !data) return <CenterLoadingSpinner />;

    const otherParticipants = data.subcourse!.otherParticipants;

    if (otherParticipants.length === 0) return <Typography>{t('single.global.noMembers')}</Typography>;

    return (
        <div className="flex flex-col gap-y-6 max-w-[980px] mt-14">
            <ParticipantRow participant={data.me.pupil as any} />
            {otherParticipants.map((participant) => (
                <ParticipantRow participant={participant} />
            ))}
        </div>
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
            image {
                url
                default
            }
            category
            description
            subject
            tags{
            name
            }
            allowContact
        }
        canJoin { allowed reason }
        canContactInstructor { allowed reason }
        canJoinWaitinglist { allowed reason }
        isParticipant
        isOnWaitingList
        cancelled
        published
        publishedAt
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
            subcourse {
                published
            }
        }
        joinedAppointments {
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
    const navigate = useNavigate();
    const breadcrumbRoutes = useBreadcrumbRoutes();

    const { data, loading, refetch } = useQuery(singleSubcoursePupilQuery, {
        variables: {
            subcourseId,
        },
    });

    const { subcourse } = data ?? {};
    const { course } = subcourse ?? {};
    const appointments = useMemo(() => {
        const appointmentsList = (subcourse?.isParticipant ? subcourse?.joinedAppointments : subcourse?.appointments) ?? [];
        return appointmentsList.filter((e) => {
            const appointmentStart = DateTime.fromISO(e.start);
            const appointmentEnd = appointmentStart.plus({ minutes: e.duration });
            return appointmentEnd > DateTime.now();
        });
    }, [subcourse?.joinedAppointments, subcourse?.appointments, subcourse?.isParticipant]);

    const myNextAppointment = useMemo(() => {
        const now = DateTime.now();
        const next = appointments.find((appointment) => {
            const appointmentStart = DateTime.fromISO(appointment.start);
            const appointmentEnd = DateTime.fromISO(appointment.start).plus({ minutes: appointment.duration });

            const isWithinTimeFrame = appointmentStart.diff(now, 'minutes').minutes <= 240 && appointmentEnd.diff(now, 'minutes').minutes >= -5;
            return isWithinTimeFrame;
        });

        return next;
    }, [appointments]);

    const isInPast = useMemo(
        () =>
            !subcourse ||
            subcourse.appointments.every((lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis()),
        [subcourse]
    );

    const isActiveSubcourse = useMemo(() => {
        const today = DateTime.now().endOf('day');
        const isSubcourseCancelled = subcourse?.cancelled;
        if (isSubcourseCancelled) return false;

        const lastLecture = appointments[appointments.length - 1];
        const lastLecturePlus30Days = DateTime.fromISO(lastLecture?.start).plus({ days: 30 });
        const is30DaysBeforeToday = lastLecturePlus30Days < today;
        return !is30DaysBeforeToday;
    }, [appointments, subcourse?.cancelled]);

    const showParticipantsTab = subcourse?.isParticipant && subcourse.course.category !== Course_Category_Enum.HomeworkHelp;
    const showTabsControls = showParticipantsTab;

    useEffect(() => {
        if (!loading && isInPast && !subcourse?.isParticipant) {
            navigate('/group');
            toast.error(t('course.error.isInPastOrInvalid'));
        }
    }, [loading, isInPast, subcourse?.isParticipant]);
    return (
        <WithNavigation
            headerTitle={course?.name.substring(0, 20)}
            previousFallbackRoute="/group"
            isLoading={loading}
            headerLeft={
                <div className="flex items-center flex-row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </div>
            }
        >
            <div className="flex flex-col gap-y-11 max-w-5xl mx-auto">
                <div>
                    <Breadcrumb items={[breadcrumbRoutes.COURSES, { label: course?.name! }]} />
                    {course && subcourse && (
                        <SubcourseData course={course} subcourse={{ ...subcourse, lectures: subcourse.appointments }} isInPast={isInPast} />
                    )}
                </div>
                {course && subcourse && !isInPast && (
                    <PupilCourseButtons
                        appointment={myNextAppointment as Lecture}
                        subcourse={subcourse}
                        refresh={refetch}
                        isActiveSubcourse={isActiveSubcourse}
                        isHomeworkHelp={course.category === Course_Category_Enum.HomeworkHelp}
                    />
                )}
                {subcourse?.isParticipant && !isInPast && (
                    <PupilJoinedCourseBanner
                        courseStatus={getTrafficStatus(subcourse?.participantsCount, subcourse?.maxParticipants)}
                        seatsLeft={subcourse?.maxParticipants - subcourse?.participantsCount}
                    />
                )}

                <Tabs defaultValue="lectures">
                    {showTabsControls && (
                        <TabsList>
                            <TabsTrigger value="lectures">{t('single.tabs.lessons')}</TabsTrigger>
                            {showParticipantsTab && <TabsTrigger value="participants">{t('single.tabs.participant')}</TabsTrigger>}
                        </TabsList>
                    )}
                    <TabsContent value="lectures">
                        <div className="mt-8 max-h-full overflow-y-scroll">
                            <AppointmentList
                                appointments={appointments as Appointment[]}
                                isReadOnly={!subcourse?.isParticipant}
                                disableScroll
                                isHomeworkHelp={course?.category === Course_Category_Enum.HomeworkHelp}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="participants">{subcourse && showParticipantsTab && <OtherParticipants subcourseId={subcourseId} />}</TabsContent>
                </Tabs>
            </div>
        </WithNavigation>
    );
};

export default SingleCoursePupil;
