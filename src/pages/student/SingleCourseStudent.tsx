import { useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { Box, Modal, Stack, Text, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useCallback, useMemo, useState } from 'react';
import { gql } from '../../gql';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs, { Tab } from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import { Course_Coursestate_Enum } from '../../gql/graphql';
import { getTimeDifference } from '../../helper/notification-helper';
import CancelSubCourseModal from '../../modals/CancelSubCourseModal';
import { getTrafficStatus } from '../../Utility';
import Banner from '../../widgets/Banner';
import PromoteBanner from '../../widgets/PromoteBanner';
import Waitinglist from '../single-course/Waitinglist';
import ParticipantRow from '../subcourse/ParticipantRow';
import SubcourseData from '../subcourse/SubcourseData';
import StudentCourseButtons from './single-course/StudentCourseButtons';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import { Appointment } from '../../types/lernfair/Appointment';
import HelpNavigation from '../../components/HelpNavigation';

function Participants({ subcourseId }: { subcourseId: number }) {
    const { t } = useTranslation();
    const { data, loading } = useQuery(
        gql(`
        query GetParticipants($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId){
                participants {
                    firstname
                    lastname
                    schooltype
                    grade
                }
            }
        }
    `),
        { variables: { subcourseId } }
    );

    if (loading) return <CenterLoadingSpinner />;

    const participants = data?.subcourse?.participants ?? [];

    if (participants.length === 0) return <Text>{t('single.global.noMembers')}</Text>;

    return (
        <>
            {participants.map((participant) => (
                <ParticipantRow participant={participant} />
            ))}
        </>
    );
}

const basicSubcourseQuery = gql(`
query GetBasicSubcourseStudent($subcourseId: Int!) {
    subcourse(subcourseId: $subcourseId){
        id
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
              title
              description
              start
              duration
              displayName
              position
              total
              organizers(skip: 0, take: 5) {
                id
                firstname
                lastname
              }
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

const instructorSubcourseQuery = gql(`
query GetInstructorSubcourse($subcourseId: Int!) {
    subcourse(subcourseId: $subcourseId){
        alreadyPromoted
        pupilsWaitingCount
        pupilsOnWaitinglist {
            id
            firstname
            lastname
            schooltype
            grade
        }
        canEdit { allowed reason }
        canContactParticipants { allowed reason }
        canCancel { allowed reason }
    }
}
`);
const SingleCourseStudent = () => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);
    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const toast = useToast();

    const sectionSpacing = useBreakpointValue({
        base: space['1'],
        lg: space['4'],
    });

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
        toast.show({ description: 'Kurs veröffentlicht - Schüler können ihn jetzt sehen', placement: 'top' });
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
        toast.show({ description: 'Kurs zur Prüfung freigegeben', placement: 'top' });
        refetchBasics();
    }, []);

    const [cancelSubcourse, { data: canceldData }] = useMutation(
        gql(`mutation CancelSubcourse($subcourseId: Float!) {
        subcourseCancel(subcourseId: $subcourseId)
      }`),
        { variables: { subcourseId: subcourseId } }
    );

    const cancelCourse = useCallback(async () => {
        await cancelSubcourse();
        toast.show({ description: 'Der Kurs wurde erfolgreich abgesagt', placement: 'top' });
        refetchBasics();
        setShowCancelModal(false);
    }, [canceldData]);

    console.log('SINGLE KURSTERMINE', data?.subcourse?.appointments);
    const tabs: Tab[] = [
        {
            title: t('single.tabs.lessons'),
            content: (
                <Box minH={300}>
                    <AppointmentList isReadOnlyList appointments={data?.subcourse?.appointments as Appointment[]} />
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

    if (subcourse?.isInstructor) {
        tabs.push({
            title: t('single.tabs.participant'),
            badge: subcourse?.participantsCount,
            content: (
                <>
                    <Participants subcourseId={subcourseId} />
                </>
            ),
        });
    }

    if (subcourse?.isInstructor && instructorSubcourse?.subcourse) {
        tabs.push({
            title: t('single.tabs.waitinglist'),
            badge: instructorSubcourse.subcourse.pupilsWaitingCount,
            content: (
                <>
                    <Waitinglist
                        subcourseId={subcourseId}
                        maxParticipants={subcourse?.maxParticipants}
                        pupilsOnWaitinglist={instructorSubcourse.subcourse.pupilsOnWaitinglist}
                        refetch={() => {
                            refetchInstructorData();
                            return refetchBasics();
                        }}
                    />
                </>
            ),
        });
    }

    const [promote, { error }] = useMutation(
        gql(`
    mutation subcoursePromote($subcourseId: Float!) {
        subcoursePromote(subcourseId: $subcourseId)
    }
`),
        { variables: { subcourseId: subcourseId } }
    );

    const doPromote = async () => {
        await promote();
        if (error) {
            toast.show({ description: t('single.buttonPromote.toastFail'), placement: 'top' });
        } else {
            toast.show({ description: t('single.buttonPromote.toast'), placement: 'top' });
        }
        refetchInstructorData();
    };

    const isInPast = useMemo(
        () =>
            !subcourse ||
            subcourse.lectures.every((lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis()),
        [subcourse]
    );

    const isMatureForPromotion = (publishDate: string): boolean => {
        const { daysDiff } = getTimeDifference(publishDate);
        if (publishDate === null || daysDiff > 3) {
            return true;
        }
        return false;
    };

    const canPromoteCourse = useMemo(() => {
        if (loading || !subcourse || !subcourse.published || !subcourse?.isInstructor || instructorSubcourse?.subcourse?.alreadyPromoted !== false)
            return false;
        const canPromote = subcourse.capacity < 0.75 && isMatureForPromotion(subcourse.publishedAt);
        return canPromote;
    }, [instructorSubcourse?.subcourse?.alreadyPromoted, loading, subcourse]);

    const getButtonClick = useMemo(() => {
        switch (course?.courseState) {
            case Course_Coursestate_Enum.Created:
                return () => submitCourse();
            case Course_Coursestate_Enum.Allowed:
                return () => doPublish();
            default:
                return () => submitCourse();
        }
    }, [course?.courseState, doPublish, submitCourse]);

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
            {subLoading ? (
                <CenterLoadingSpinner />
            ) : (
                <Stack space={sectionSpacing} paddingX={space['1.5']}>
                    <SubcourseData
                        course={course!}
                        subcourse={isInstructorOfSubcourse && !subLoading ? { ...subcourse!, ...instructorSubcourse!.subcourse! } : subcourse!}
                        isInPast={isInPast}
                        hideTrafficStatus={canPromoteCourse}
                    />
                    {isInstructorOfSubcourse && !subcourse?.cancelled && !subLoading && (
                        <StudentCourseButtons subcourse={{ ...subcourse!, ...instructorSubcourse!.subcourse! }} refresh={refetchBasics} />
                    )}
                    {subcourse && isInstructorOfSubcourse && subcourse.published && !subLoading && !isInPast && canPromoteCourse && (
                        <PromoteBanner
                            onClick={doPromote}
                            seatsFull={subcourse?.participantsCount}
                            seatsMax={subcourse?.maxParticipants}
                            isPromoted={instructorSubcourse?.subcourse?.alreadyPromoted || false}
                            courseStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
                        />
                    )}
                    {!isInPast && isInstructorOfSubcourse && (
                        <Banner
                            courseState={course!.courseState!}
                            isCourseCancelled={subcourse!.cancelled}
                            isPublished={subcourse!.published}
                            handleButtonClick={subcourse?.published ? () => setShowCancelModal(true) : getButtonClick}
                        />
                    )}
                    <Tabs tabs={tabs} />
                </Stack>
            )}
            <Modal>
                <CancelSubCourseModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onCourseCancel={cancelCourse} />
            </Modal>
        </WithNavigation>
    );
};

export default SingleCourseStudent;
