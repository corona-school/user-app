import { useQuery, useMutation } from '@apollo/client';
import { gql } from '../../gql';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NavigationTabs, { Tab } from '../../components/NavigationTabs';
import { useParams } from 'react-router-dom';
import { Box, Stack, useBreakpointValue, useTheme, Text, useToast } from 'native-base';
import SubcourseData from '../subcourse/SubcourseData';
import { Course, Subcourse } from '../../gql/graphql';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import AppointmentList from '../../widgets/AppointmentList';
import { Appointment } from '../../types/lernfair/Appointment';
import ScreenerCourseButtons from './single-course/ScreenerCourseButtons';
import { ConfirmModal } from '../../modals/ConfirmModal';

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
            image
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

    const [showAllowModal, setShowAllowModal] = useState(false);
    const [showDenyModal, setShowDenyModal] = useState(false);

    const toast = useToast();
    const { t } = useTranslation();
    const { space, sizes } = useTheme();

    const sectionSpacing = useBreakpointValue({
        base: space['1'],
        lg: space['4'],
    });

    const { data, loading } = useQuery(subcourseQuery, { variables: { subcourseId: subcourseId } });
    const { subcourse } = data ?? {};

    const [allowCourse] = useMutation(
        gql(`
            mutation allowCourse($subcourseId: Float!){
                courseAllow(courseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourseId },
            refetchQueries: [subcourseQuery],
        }
    );

    const [denyCourse] = useMutation(
        gql(`
            mutation denyCourse($subcourseId: Float!){
                courseDeny(courseId: $subcourseId)
            }
        `),
        {
            variables: { subcourseId: subcourseId },
            refetchQueries: [subcourseQuery],
        }
    );

    const [shareCourseMutation] = useMutation(
        gql(`
            mutation shareCourse($courseId: Float!, $share: Boolean!) {
                courseMarkShared(shared: $share, courseId: $courseId){shared}
            }
        `),
        {
            refetchQueries: [subcourseQuery],
        }
    );

    const shareCourse = (share: boolean) => {
        shareCourseMutation({
            variables: {
                courseId: subcourse?.course.id ?? -1,
                share,
            },
        });
    };

    const isInPast = useMemo(
        () =>
            !data?.subcourse ||
            data?.subcourse.lectures.every((lecture) => DateTime.fromISO(lecture.start).toMillis() + lecture.duration * 60000 < DateTime.now().toMillis()),
        [data?.subcourse]
    );

    const tabs: Tab[] = [
        {
            title: t('single.tabs.lessons'),
            content: (
                <Box minH={300}>
                    <AppointmentList isReadOnlyList={false} disableScroll appointments={data?.subcourse?.appointments as Appointment[]} />
                </Box>
            ),
        },
        {
            title: t('single.tabs.description'),
            content: (
                <Text maxWidth={sizes['imageHeaderWidth']} marginBottom={space['1']}>
                    {subcourse?.course?.description}
                </Text>
            ),
        },
    ];

    return (
        <WithNavigation showBack>
            {loading ? (
                <CenterLoadingSpinner />
            ) : (
                <Stack space={sectionSpacing} paddingX={space['1.5']}>
                    <SubcourseData course={subcourse?.course as Course} subcourse={subcourse as Subcourse} isInPast={isInPast} />
                    <ScreenerCourseButtons
                        courseState={subcourse?.course.courseState}
                        subcourseId={subcourseId}
                        isShared={subcourse?.course.shared}
                        onAllow={() => setShowAllowModal(true)}
                        onDeny={() => setShowDenyModal(true)}
                        onShare={() => {
                            if (subcourse) shareCourse(!subcourse?.course.shared);
                            toast.show({ description: t(`screening.courses.toast.${subcourse?.course.shared ? 'unshared' : 'shared'}`), placement: 'top' });
                        }}
                    />
                    <NavigationTabs tabs={tabs} />
                </Stack>
            )}
            <ConfirmModal
                text={t('screening.courses.are_you_shure_allow')}
                isOpen={showAllowModal}
                onConfirmed={() => {
                    allowCourse();
                    setShowAllowModal(false);
                    toast.show({ description: t('screening.courses.toast.allowed'), placement: 'top' });
                }}
                onClose={() => setShowAllowModal(false)}
            />
            <ConfirmModal
                text={t('screening.courses.are_you_shure_deny')}
                isOpen={showDenyModal}
                onConfirmed={() => {
                    denyCourse();
                    setShowDenyModal(false);
                    toast.show({ description: t('screening.courses.toast.denied'), placement: 'top' });
                }}
                onClose={() => setShowDenyModal(false)}
            />
        </WithNavigation>
    );
};

export default SingleCourseScreener;
