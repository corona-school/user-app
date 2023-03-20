import { gql, useMutation, useQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { Heading, Modal, Row, Stack, Text, useTheme, useToast } from 'native-base';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs, { Tab } from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import { Course_Coursestate_Enum, Lecture, Participant } from '../../gql/graphql';
import { getTimeDifference } from '../../helper/notification-helper';
import CancelSubCourseModal from '../../modals/CancelSubCourseModal';
import CourseConfirmationModal from '../../modals/CourseConfirmationModal';
import { getTrafficStatus } from '../../Utility';
import Banner from '../../widgets/Banner';
import PromoteBanner from '../../widgets/PromoteBanner';
import ParticipantRow from '../subcourse/ParticipantRow';
import SubcourseData from '../subcourse/SubcourseData';
import StudentCourseButtons from './single-course/StudentCourseButtons';

function Participants({ subcourseId }: { subcourseId: number }) {
    const { t } = useTranslation();
    const { data } = useQuery(
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

    if (!data) return <CenterLoadingSpinner />;

    const participants = data!.subcourse!.participants;

    if (participants.length === 0) return <Text>{t('single.global.noMembers')}</Text>;

    return (
        <>
            {participants.map((participant: Participant) => (
                <ParticipantRow participant={participant} />
            ))}
        </>
    );
}

const singleSubcourseStudentQuery = gql(`
query GetSingleSubcourseStudent($subcourseId: Int!, $isStudent: Boolean = false) {
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
        isParticipant
        isOnWaitingList
        alreadyPromoted @include(if: $isStudent)
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

    const { data, loading, refetch } = useQuery(singleSubcourseStudentQuery, {
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
        refetch();
    }, []);

    const [submit] = useMutation(
        gql(`
        mutation CourseSubmit($courseId: Float!) { 
            courseSubmit(courseId: $courseId)
        }
    `),
        { variables: { courseId: course?.id } }
    );

    const submitCourse = useCallback(async () => {
        await submit();
        toast.show({ description: 'Kurs zur Prüfung freigegeben', placement: 'top' });
        refetch();
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
        refetch();
        setShowCancelModal(false);
    }, [canceldData]);

    const tabs: Tab[] = [
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
        {
            title: t('single.tabs.lessons'),
            content: (
                <>
                    {((subcourse?.lectures?.length ?? 0) > 0 &&
                        subcourse!.lectures.map((lecture: Lecture, i: number) => (
                            <Row maxWidth={sizes['imageHeaderWidth']} flexDirection="column" marginBottom={space['1.5']}>
                                <Heading paddingBottom={space['0.5']} fontSize="md">
                                    {t('single.global.lesson')} {`${i + 1}`.padStart(2, '0')}
                                </Heading>
                                <Text paddingBottom={space['0.5']}>
                                    {DateTime.fromISO(lecture.start).toFormat('dd.MM.yyyy')}
                                    <Text marginX="3px">•</Text>
                                    {DateTime.fromISO(lecture.start).toFormat('HH:mm')} {t('single.global.clock')}
                                </Text>
                                <Text>
                                    <Text bold>{t('single.global.duration')}: </Text>{' '}
                                    {(typeof lecture?.duration !== 'number' ? parseInt(lecture?.duration) : lecture?.duration) / 60} {t('single.global.hours')}
                                </Text>
                            </Row>
                        ))) || <Text>{t('single.global.noLections')}</Text>}
                </>
            ),
        },
    ];

    if (subcourse?.isInstructor || subcourse?.isParticipant) {
        tabs.push({
            title: t('single.tabs.participant'),
            content: (
                <>
                    <Participants subcourseId={subcourseId} />
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
        refetch();
    };

    const isInPast = useMemo(
        () =>
            !subcourse ||
            subcourse.lectures.every((lecture: Lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis()),
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
        if (loading || !subcourse || !subcourse.published || !subcourse?.isInstructor || !subcourse.hasOwnProperty('alreadyPromoted')) return false;
        const canPromote = subcourse.capacity < 0.75 && isMatureForPromotion(subcourse.publishedAt);
        return canPromote;
    }, [loading, subcourse]);

    const getButtonClick = useMemo(() => {
        switch (course?.courseState) {
            case Course_Coursestate_Enum.Created:
                return () => submitCourse();
            case Course_Coursestate_Enum.Allowed:
                return () => doPublish();
            default:
                return () => submitCourse();
        }
    }, [course?.courseState, doPublish, submit, submitCourse]);

    return (
        <WithNavigation headerTitle={course?.name.substring(0, 20)} showBack isLoading={loading} headerLeft={<NotificationAlert />}>
            <Stack space={space['3']} paddingX={space['1.5']}>
                <SubcourseData course={course} subcourse={subcourse} isInPast={isInPast} />
                {!isInPast && !subcourse?.cancelled && <StudentCourseButtons subcourse={subcourse} refresh={refetch} />}
                {subcourse && subcourse.published && !isInPast && canPromoteCourse && (
                    <PromoteBanner
                        onClick={doPromote}
                        isPromoted={subcourse?.alreadyPromoted || false}
                        courseStatus={getTrafficStatus(subcourse.participantsCount || 0, subcourse.maxParticipants || 0)}
                    />
                )}
                {!isInPast && (
                    <Banner
                        courseState={course?.courseState}
                        isCourseCancelled={subcourse?.cancelled}
                        isPublished={subcourse?.published}
                        handleButtonClick={subcourse?.published ? () => setShowCancelModal(true) : getButtonClick}
                    />
                )}
                <Tabs tabs={tabs} />
            </Stack>
            <Modal>
                <CancelSubCourseModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onCourseCancel={cancelCourse} />
            </Modal>
        </WithNavigation>
    );
};

export default SingleCourseStudent;
