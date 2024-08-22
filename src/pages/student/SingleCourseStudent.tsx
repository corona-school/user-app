import { useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useMemo, useState } from 'react';
import { gql } from '../../gql';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import WithNavigation from '../../components/WithNavigation';
import { Course_Coursestate_Enum, Lecture } from '../../gql/graphql';
import Banner from '../../widgets/CourseBanner';
import PromoteBanner from '../../widgets/PromoteBanner';
import Waitinglist from '../single-course/Waitinglist';
import ParticipantRow from '../subcourse/ParticipantRow';
import SubcourseData from '../subcourse/SubcourseData';
import StudentCourseButtons from './single-course/StudentCourseButtons';
import AppointmentList from '../../widgets/AppointmentList';
import { Appointment } from '../../types/lernfair/Appointment';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import AppointmentsEmptyState from '../../widgets/AppointmentsEmptyState';
import { SubcourseParticipant } from '../../types/lernfair/Course';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import RemoveParticipantFromCourseModal from '@/modals/RemoveParticipantFromCourseModal';
import CancelSubCourseModal from '@/modals/CancelSubCourseModal';
import { Typography } from '@/components/Typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Panels';

function Participants({
    subcourseId,
    contactParticipant,
    isInstructor,
    onParticipantRemoved,
}: {
    subcourseId: number;
    contactParticipant: (participantId: string) => void;
    isInstructor: boolean;
    onParticipantRemoved: () => void;
}) {
    const { t } = useTranslation();
    const { data, loading, refetch } = useQuery(
        gql(`
        query GetParticipants($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId){
                participants {
                    id
                    firstname
                    lastname
                    schooltype
                    grade
                    gradeAsInt
                }
            }
        }
    `),
        { variables: { subcourseId } }
    );
    const [isRemoveParticipantModalOpen, setIsRemoveParticipantModalOpen] = useState(false);
    const [participantToRemove, setParticipantToRemove] = useState<SubcourseParticipant>();

    const handleOpenModal = (participant: SubcourseParticipant) => {
        setIsRemoveParticipantModalOpen(true);
        setParticipantToRemove(participant);
    };
    const handleOnParticipantRemoved = async () => {
        setParticipantToRemove(undefined);
        onParticipantRemoved();
        await refetch();
    };

    if (loading) return <CenterLoadingSpinner />;

    const participants = data?.subcourse?.participants ?? [];

    if (participants.length === 0) return <p>{t('single.global.noMembers')}</p>;

    return (
        <>
            {participants.map((participant) => (
                <ParticipantRow
                    participant={participant}
                    isInstructor={isInstructor}
                    contactParticipant={contactParticipant}
                    removeParticipant={handleOpenModal}
                />
            ))}
            {participantToRemove && (
                <RemoveParticipantFromCourseModal
                    subcourseId={subcourseId}
                    isOpen={isRemoveParticipantModalOpen}
                    onOpenChange={setIsRemoveParticipantModalOpen}
                    participant={participantToRemove}
                    onParticipantRemoved={handleOnParticipantRemoved}
                />
            )}
        </>
    );
}

const basicSubcourseQuery = gql(`
query GetBasicSubcourseStudent($subcourseId: Int!) {
    subcourse(subcourseId: $subcourseId){
        id
        allowChatContactProspects
        allowChatContactParticipants
        groupChatType
        participantsCount
        maxParticipants
        minGrade
        maxGrade
        capacity
        cancelled
        published
        publishedAt
        isInstructor
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
              organizers(skip: 0, take: 5) {
                id
                firstname
                lastname
              }
              subcourse {
                published
              }
            }
    }
}
`);

const instructorSubcourseQuery = gql(`
query GetInstructorSubcourse($subcourseId: Int!) {
    subcourse(subcourseId: $subcourseId){
        conversationId
        wasPromotedByInstructor
        canPromote {
            allowed
        }
        pupilsWaitingCount
        pupilsOnWaitinglist {
            id
            firstname
            lastname
            schooltype
            grade
            gradeAsInt
        }
        canEdit { allowed reason }
        canContactParticipants { allowed reason }
        canCancel { allowed reason }
        appointments {
            participants(skip: 0, take: 50) {
                id
                firstname
                lastname
                isPupil
                isStudent
            }
        }
    }
}
`);
const SingleCourseStudent = () => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);
    const { t } = useTranslation();

    const navigate = useNavigate();

    const {
        data,
        loading,
        refetch: refetchBasics,
    } = useQuery(basicSubcourseQuery, {
        variables: {
            subcourseId,
        },
    });

    const isInstructorOfSubcourse = useMemo(() => {
        if (data?.subcourse?.isInstructor) return true;
        return false;
    }, [data?.subcourse?.isInstructor]);

    const {
        data: instructorSubcourse,
        loading: subLoading,
        refetch: refetchInstructorData,
    } = useQuery(instructorSubcourseQuery, {
        skip: !data?.subcourse?.isInstructor,
        variables: {
            subcourseId,
        },
    });

    const { subcourse } = data ?? {};
    const { course } = subcourse ?? {};
    const appointments = subcourse?.appointments ?? [];
    const myNextAppointment = useMemo(() => {
        const now = DateTime.now();
        const next = appointments.find((appointment) => {
            const appointmentStart = DateTime.fromISO(appointment.start);
            const appointmentEnd = DateTime.fromISO(appointment.start).plus(appointment.duration);

            const isWithinTimeFrame = appointmentStart.diff(now, 'minutes').minutes <= 240 && appointmentEnd.diff(now, 'minutes').minutes >= -5;

            return isWithinTimeFrame;
        });

        return next;
    }, [appointments]);

    const [publish] = useMutation(
        gql(`
        mutation SubcoursePublish($subcourseId: Float!) {
            subcoursePublish(subcourseId: $subcourseId)
        }
    `),
        { variables: { subcourseId: subcourseId } }
    );

    const doPublish = useCallback(async () => {
        await publish();
        toast.success('Kurs veröffentlicht - Schüler können ihn jetzt sehen');
        refetchBasics();
    }, []);

    const [submit] = useMutation(
        gql(`
        mutation CourseSubmit($courseId: Float!) { 
            courseSubmit(courseId: $courseId)
        }
    `),
        { variables: { courseId: course?.id! } }
    );

    const submitCourse = useCallback(async () => {
        await submit();
        toast.success('Kurs zur Prüfung freigegeben');
        refetchBasics();
    }, []);

    const [contactParticipant] = useMutation(
        gql(`
            mutation contactCourseParticipant($memberUserId: String!, $subcourseId: Float!) {
                participantChatCreate(memberUserId: $memberUserId, subcourseId: $subcourseId)
            }
        `)
    );

    const [chatCreateAsProspect] = useMutation(
        gql(`
            mutation createProspectChat($subcourseId: Float!, $instructorUserId: String!) {
                prospectChatCreate(subcourseId: $subcourseId, instructorUserId: $instructorUserId)
            }       
        `)
    );

    async function contactInstructorAsProspect() {
        try {
            const conversation = await chatCreateAsProspect({
                variables: { subcourseId: subcourse!.id, instructorUserId: `student/${subcourse!.instructors[0].id}` },
            });
            navigate('/chat', { state: { conversationId: conversation?.data?.prospectChatCreate } });
        } catch (error) {
            toast.error(t('chat.chatError'));
        }
    }

    const isInPast = useMemo(
        () =>
            !subcourse ||
            subcourse.lectures.every((lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis()),
        [subcourse]
    );

    const canPromoteCourse = useMemo(() => {
        if (loading || !subcourse || !instructorSubcourse?.subcourse?.canPromote.allowed) {
            return false;
        }

        return true;
    }, [loading, subcourse, instructorSubcourse?.subcourse?.canPromote.allowed]);

    const getButtonClick = useMemo(() => {
        switch (course?.courseState) {
            case Course_Coursestate_Enum.Created:
                return () => submitCourse();
            case Course_Coursestate_Enum.Allowed:
                return () => doPublish();
            case Course_Coursestate_Enum.Denied:
                return () => navigate('/hilfebereich', { state: { tabID: 2 } });
            default:
                return () => submitCourse();
        }
    }, [course?.courseState, doPublish, submitCourse]);

    const doContactParticipant = async (memberUserId: string) => {
        const conversation = await contactParticipant({ variables: { memberUserId: memberUserId, subcourseId: subcourseId } });
        navigate('/chat', { state: { conversationId: conversation?.data?.participantChatCreate } });
    };

    const handleOnPromoted = async () => {
        await refetchInstructorData();
    };

    const isActiveSubcourse = useMemo(() => {
        const today = DateTime.now().endOf('day');
        const isSubcourseCancelled = subcourse?.cancelled;
        if (isSubcourseCancelled) return false;

        const lastLecture = appointments[appointments.length - 1];
        const lastLecturePlus30Days = DateTime.fromISO(lastLecture?.start).plus({ days: 30 });
        const is30DaysBeforeToday = lastLecturePlus30Days < today;
        return !is30DaysBeforeToday;
    }, [appointments, subcourse?.cancelled]);

    return (
        <WithNavigation
            headerTitle={course?.name.substring(0, 20)}
            showBack
            previousFallbackRoute="/group"
            isLoading={loading}
            headerLeft={
                <div className="flex items-center flex-row">
                    <SwitchLanguageButton />
                    <NotificationAlert />
                </div>
            }
        >
            {subLoading ? (
                <CenterLoadingSpinner />
            ) : (
                <div className="flex flex-col gap-y-11 max-w-5xl mx-auto">
                    <SubcourseData
                        course={course!}
                        subcourse={isInstructorOfSubcourse && !subLoading ? { ...subcourse!, ...instructorSubcourse!.subcourse! } : subcourse!}
                        isInPast={isInPast}
                        hideTrafficStatus={canPromoteCourse}
                    />
                    <div className="flex flex-col gap-y-11 justify-between xl:flex-row">
                        <div className="flex flex-col gap-y-11 justify-between w-full">
                            {isInstructorOfSubcourse && !subcourse?.cancelled && !subLoading && (
                                <StudentCourseButtons
                                    subcourse={{ ...subcourse!, ...instructorSubcourse!.subcourse! }}
                                    refresh={refetchBasics}
                                    appointment={myNextAppointment as Lecture}
                                    isActiveSubcourse={isActiveSubcourse}
                                />
                            )}
                            {!isInstructorOfSubcourse && subcourse?.allowChatContactProspects && isActiveSubcourse && (
                                <div>
                                    <Button variant="outline" onClick={contactInstructorAsProspect}>
                                        {t('single.actions.contactInstructor')}
                                    </Button>
                                </div>
                            )}
                            {!isInPast && isInstructorOfSubcourse && (
                                <Banner
                                    courseState={course!.courseState!}
                                    isCourseCancelled={subcourse!.cancelled}
                                    isPublished={subcourse!.published}
                                    handleButtonClick={subcourse?.published ? () => setShowCancelModal(true) : getButtonClick}
                                />
                            )}
                        </div>
                        {subcourse &&
                            instructorSubcourse?.subcourse &&
                            isInstructorOfSubcourse &&
                            subcourse.published &&
                            !subLoading &&
                            !isInPast &&
                            canPromoteCourse && (
                                <PromoteBanner
                                    onPromoted={handleOnPromoted}
                                    subcourse={{
                                        id: subcourse.id,
                                        wasPromotedByInstructor: instructorSubcourse.subcourse.wasPromotedByInstructor,
                                    }}
                                />
                            )}
                    </div>
                    <Tabs defaultValue="lectures">
                        <TabsList>
                            <TabsTrigger value="lectures">{t('single.tabs.lessons')}</TabsTrigger>
                            {subcourse?.isInstructor && (
                                <TabsTrigger badge={subcourse?.participantsCount} value="participants">
                                    {t('single.tabs.participant')}
                                </TabsTrigger>
                            )}
                            {subcourse?.isInstructor && instructorSubcourse?.subcourse && (
                                <TabsTrigger badge={instructorSubcourse.subcourse.pupilsWaitingCount} value="waiting-list">
                                    {t('single.tabs.waitinglist')}
                                </TabsTrigger>
                            )}
                        </TabsList>
                        <TabsContent value="lectures">
                            {appointments.length > 0 ? (
                                <AppointmentList
                                    isReadOnlyList={!subcourse?.isInstructor}
                                    disableScroll
                                    appointments={appointments as Appointment[]}
                                    noOldAppointments
                                    height="340px"
                                    isFullWidth
                                />
                            ) : (
                                <div className="justify-center">
                                    <AppointmentsEmptyState
                                        title={t('appointment.empty.noAppointments')}
                                        subtitle={t('appointment.empty.noAppointmentsDesc')}
                                    />
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="participants">
                            {subcourse && subcourse.isInstructor && (
                                <Participants
                                    subcourseId={subcourseId}
                                    isInstructor={subcourse.isInstructor}
                                    contactParticipant={(memberUserId: string) => doContactParticipant(memberUserId)}
                                    onParticipantRemoved={refetchBasics}
                                />
                            )}
                        </TabsContent>
                        {subcourse?.isInstructor && instructorSubcourse?.subcourse && (
                            <TabsContent value="waiting-list">
                                <Waitinglist
                                    subcourseId={subcourseId}
                                    maxParticipants={subcourse?.maxParticipants}
                                    pupilsOnWaitinglist={instructorSubcourse.subcourse.pupilsOnWaitinglist}
                                    refetch={() => {
                                        refetchInstructorData();
                                        return refetchBasics();
                                    }}
                                />
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            )}
            {subcourse?.id && (
                <CancelSubCourseModal subcourseId={subcourse?.id} isOpen={showCancelModal} onOpenChange={setShowCancelModal} onCourseCanceled={refetchBasics} />
            )}
        </WithNavigation>
    );
};

export default SingleCourseStudent;
