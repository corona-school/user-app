import { HStack, Stack, VStack, Text, Heading, Box, Image, useTheme, useBreakpointValue, Badge } from 'native-base';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tag from '../../components/Tag';
import { Course, Course_Tag, Instructor, Lecture, Subcourse } from '../../gql/graphql';
import { useUserType } from '../../hooks/useApollo';
import { useLayoutHelper } from '../../hooks/useLayoutHelper';
import { TrafficStatus } from '../../types/lernfair/Course';
import Utility, { getGradeLabel, getTrafficStatus } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import CourseTrafficLamp from '../../widgets/CourseTrafficLamp';

type SubcourseDataProps = {
    course: Pick<Course, 'name' | 'image'> & { shared?: boolean; tags: Pick<Course_Tag, 'name'>[] };
    subcourse: Pick<Subcourse, 'maxParticipants' | 'participantsCount' | 'minGrade' | 'maxGrade' | 'cancelled' | 'published' | 'publishedAt'> &
        Partial<Pick<Subcourse, 'isOnWaitingList' | 'isParticipant' | 'canJoin'>> & {
            instructors: Pick<Instructor, 'firstname' | 'lastname'>[];
            lectures: Pick<Lecture, 'start' | 'duration'>[];
        };
    isInPast: boolean;
    hideTrafficStatus?: boolean;
};

const SubcourseData: React.FC<SubcourseDataProps> = ({ course, subcourse, isInPast, hideTrafficStatus = false }) => {
    const { t } = useTranslation();
    const { sizes } = useTheme();
    const { isMobile } = useLayoutHelper();
    const userType = useUserType();

    const ImageHeight = useBreakpointValue({
        base: '178px',
        lg: '300px',
    });

    const ContainerWidth = useBreakpointValue({
        base: 'full',
        lg: '50%',
    });

    const seatsLeft: number = useMemo(() => {
        return subcourse?.maxParticipants - subcourse?.participantsCount;
    }, [subcourse?.maxParticipants, subcourse?.participantsCount]);

    const trafficStatus: TrafficStatus = useMemo(() => {
        return getTrafficStatus(subcourse?.participantsCount, subcourse?.maxParticipants);
    }, [subcourse?.maxParticipants, subcourse?.participantsCount]);

    const today = new Date();
    const aWeekAgo = today.setDate(today.getDate() - 7);
    const isCourseNewlyAdded = subcourse?.publishedAt?.getTime() ?? new Date(0).getTime() > aWeekAgo;

    return (
        <>
            <Stack direction={isMobile ? 'column-reverse' : 'row'}>
                <VStack space="5" width={ContainerWidth}>
                    <HStack space="3">
                        {course?.tags?.map(({ name }) => (
                            <VStack>
                                <Tag text={name} />
                            </VStack>
                        ))}
                    </HStack>
                    {subcourse?.lectures.length > 0 && (
                        <Text>
                            {t('single.global.clockFrom')} {Utility.formatDate(subcourse?.lectures[0]?.start)} {t('single.global.clock')}
                        </Text>
                    )}
                    {isCourseNewlyAdded && (
                        <Badge bgColor="danger.500" _text={{ color: 'white' }} rounded="full" style={{ maxWidth: '50px' }}>
                            {t('dashboard.helpers.badges.new')}
                        </Badge>
                    )}
                    <Heading fontSize="3xl" maxW={isMobile ? 'full' : '80%'}>
                        {course?.name}
                    </Heading>
                    {subcourse?.instructors && subcourse?.instructors[0] && (
                        <Heading fontSize="lg">{subcourse?.instructors.map((it) => `${it.firstname} ${it.lastname}`).join(' • ')}</Heading>
                    )}
                    <Text maxWidth={sizes['imageHeaderWidth']}>
                        <Text bold>{t('single.courseInfo.grade')}</Text>
                        {t('single.courseInfo.class', { minGrade: getGradeLabel(subcourse?.minGrade), maxGrade: getGradeLabel(subcourse?.maxGrade) })}
                    </Text>
                    {!isInPast &&
                        !subcourse?.cancelled &&
                        subcourse?.published &&
                        !subcourse.isOnWaitingList &&
                        !hideTrafficStatus &&
                        !subcourse?.isParticipant && (
                            <CourseTrafficLamp
                                status={trafficStatus}
                                showLastSeats={userType === 'student'}
                                seatsLeft={seatsLeft}
                                seatsFull={subcourse?.participantsCount}
                                seatsMax={subcourse?.maxParticipants}
                            />
                        )}

                    {!subcourse?.cancelled && isInPast && <AlertMessage content={t('single.courseInfo.courseInPast')} />}
                    {subcourse?.cancelled && <AlertMessage content={t('single.courseInfo.courseCancelled')} />}
                    {userType === 'pupil' &&
                        !subcourse.isParticipant &&
                        Date.now() >= Date.parse(subcourse.lectures[0].start) &&
                        !isInPast &&
                        subcourse?.canJoin?.allowed && <AlertMessage content={t('single.courseInfo.courseStartedButJoinable')} />}
                    {userType === 'screener' && course?.shared && <Text>{t('single.courseInfo.is_shared')}</Text>}
                </VStack>
                <Stack width={ContainerWidth} mt="1" mb={isMobile ? '3' : '0'}>
                    <Box maxWidth={sizes['imageHeaderWidth']} height={ImageHeight}>
                        <Image
                            alt={course?.name}
                            borderRadius="8px"
                            position="absolute"
                            w="100%"
                            height="100%"
                            bgColor="gray.300"
                            source={{
                                uri: course?.image!,
                            }}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    );
};

export default SubcourseData;
