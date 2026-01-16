import { useQuery, useMutation } from '@apollo/client';
import { gql } from '../../gql';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NavigationTabs, { Tab } from '../../components/NavigationTabs';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Stack, useBreakpointValue, useTheme, Text, useToast, Card } from 'native-base';
import SubcourseData from '../subcourse/SubcourseData';
import { Course, Course_Coursestate_Enum, Subcourse } from '../../gql/graphql';
import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import AppointmentList from '../../widgets/AppointmentList';
import { Appointment } from '../../types/lernfair/Appointment';
import ScreenerCourseButtons from './single-course/ScreenerCourseButtons';
import ConfirmationModal from '@/modals/ConfirmationModal';

const subcourseQuery = gql(`
query subcourse($subcourseId: Int!) {
    subcourse(subcourseId: $subcourseId) {
        id
        participantsCount
        maxParticipants
        minGrade
        maxGrade
        cancelled
        published
        publishedAt
        nextLecture {
            start
            duration
        }
        instructors {
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
            shared
            tags {
            name
            }
        }
        lectures {
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

const SingleCourseScreener: React.FC = () => {
    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);

    const toast = useToast();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { space, sizes } = useTheme();

    const location = useLocation();
    const locState = location?.state as {
        wasEdited: boolean;
    };

    const sectionSpacing = useBreakpointValue({
        base: space['1'],
        lg: space['4'],
    });

    const { data, loading, refetch: refetchSubcourse } = useQuery(subcourseQuery, { variables: { subcourseId: subcourseId } });
    const { subcourse } = data ?? {};
    const { course } = subcourse ?? {};

    const [showAllowModal, setShowAllowModal] = useState(false);
    const [showDenyModal, setShowDenyModal] = useState(false);

    /**
     * Courses with the state "created" aren't yet approved to be screened by the course creators.
     * Their pages aren't reachable for screeners by directly using the app, but could be thru the url.
     * This is extremely unlikely to happen, but not impossible.
     * In this case we should navigate the screener back to the start page.
     */
    useEffect(() => {
        if (course?.courseState === Course_Coursestate_Enum.Created) {
            navigate('/start');
        }
    }, [course?.courseState]);

    // For refetching the course query, if the course has just been edited by the screener
    useEffect(() => {
        if (locState?.wasEdited) {
            refetchSubcourse();
        }
    }, [locState?.wasEdited]);

    const [allowCourse] = useMutation(
        gql(`
            mutation allowCourse($courseId: Float!){
                courseAllow(courseId: $courseId)
            }
        `),
        {
            onError: () => {
                refetchSubcourse(); // necessary when allowCourse runs with errors (subcourse can't be published, but course will still get allowed)
            },
        }
    );

    const [denyCourse] = useMutation(
        gql(`
            mutation denyCourse($courseId: Float!){
                courseDeny(courseId: $courseId)
            }
        `)
    );

    const [shareCourseMutation] = useMutation(
        gql(`
            mutation shareCourse($courseId: Float!, $share: Boolean!) {
                courseMarkShared(shared: $share, courseId: $courseId){shared}
            }
        `)
    );

    const shareCourse = async (share: boolean) => {
        await shareCourseMutation({
            variables: {
                courseId: course?.id ?? -1,
                share,
            },
        });
    };

    const isInPast = useMemo(
        () =>
            !subcourse ||
            subcourse?.lectures.every((lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis()),
        [subcourse]
    );

    const tabs: Tab[] = [
        {
            title: t('single.tabs.lessons'),
            content: (
                <Box minH={300}>
                    <AppointmentList
                        height="100%"
                        isReadOnlyList={true}
                        disableScroll
                        noOldAppointments
                        appointments={subcourse?.appointments as Appointment[]}
                        clickable={false}
                        editable={false}
                        exhaustive={false}
                    />
                </Box>
            ),
        },
        {
            title: t('single.tabs.description'),
            content: (
                <Text maxWidth={sizes['imageHeaderWidth']} marginBottom={space['1']}>
                    {course?.description}
                </Text>
            ),
        },
    ];

    const courseStatus = () => {
        return (
            (() => {
                switch (course?.courseState) {
                    case Course_Coursestate_Enum.Allowed:
                        return t('screening.courses.allowed');
                    case Course_Coursestate_Enum.Denied:
                        return t('screening.courses.denied');
                    case Course_Coursestate_Enum.Submitted:
                        return t('screening.courses.submitted');
                    case Course_Coursestate_Enum.Cancelled:
                        return t('screening.courses.cancelled');
                }
            })() + ` & ${subcourse?.published ? t('screening.courses.published') : t('screening.courses.not_published')}`
        );
    };

    return (
        <WithNavigation showBack>
            {loading || !course || !subcourse ? (
                <CenterLoadingSpinner />
            ) : (
                <Stack space={sectionSpacing} paddingX={space['1.5']}>
                    <SubcourseData course={course as Course} subcourse={subcourse as Subcourse} isInPast={isInPast} />
                    <Card bg="primary.100" maxWidth={sizes['imageHeaderWidth']}>
                        <Stack direction="row">
                            <Text bold fontSize="md">
                                {t('single.banner.state')}
                            </Text>
                            <Text ml="1" fontSize="md">
                                {courseStatus()}
                            </Text>
                        </Stack>
                    </Card>
                    <ScreenerCourseButtons
                        courseState={course?.courseState}
                        subcourseId={subcourseId}
                        isShared={course?.shared}
                        onAllow={() => setShowAllowModal(true)}
                        onDeny={() => setShowDenyModal(true)}
                        onShare={async () => {
                            await shareCourse(!course?.shared);
                            refetchSubcourse();
                            toast.show({ description: t(`screening.courses.toast.${course?.shared ? 'unshared' : 'shared'}`), placement: 'top' });
                        }}
                    />
                    <NavigationTabs tabs={tabs} />
                </Stack>
            )}
            {/* ALLOW COURSE MODAL */}
            <ConfirmationModal
                description={`${course?.courseState === Course_Coursestate_Enum.Denied ? t('screening.courses.already.denied') + '.\n' : ''}${t(
                    'screening.courses.are_you_sure_allow'
                )}`}
                isOpen={showAllowModal}
                onConfirm={async () => {
                    setShowAllowModal(false);
                    await allowCourse({ variables: { courseId: course?.id! } });
                    refetchSubcourse();
                    toast.show({ description: t('screening.courses.toast.allowed'), placement: 'top' });
                }}
                onOpenChange={setShowAllowModal}
                headline={t('screening.courses.allow_course')}
                confirmButtonText={t('screening.courses.allow_course')}
                variant={course?.courseState === Course_Coursestate_Enum.Denied ? 'destructive' : 'default'}
            />
            {/* DENY COURSE MODAL */}
            <ConfirmationModal
                description={t('screening.courses.are_you_sure_deny')}
                isOpen={showDenyModal}
                onConfirm={async () => {
                    setShowDenyModal(false);
                    await denyCourse({ variables: { courseId: course?.id! } });
                    refetchSubcourse();
                    toast.show({ description: t('screening.courses.toast.denied'), placement: 'top' });
                }}
                onOpenChange={setShowDenyModal}
                headline={t('screening.courses.deny_course')}
                confirmButtonText={t('screening.courses.deny_course')}
                variant="destructive"
            />
        </WithNavigation>
    );
};

export default SingleCourseScreener;
