import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Course, Course_Category_Enum, Course_Tag, Instructor, Lecture, Subcourse } from '@/gql/graphql';
import { useUserType } from '@/hooks/useApollo';
import { TrafficStatus } from '@/types/lernfair/Course';
import Utility, { getGradeLabel, getTrafficLampColor, getTrafficLampText, getTrafficStatus } from '@/Utility';
import { Typography } from '@/components/Typography';
import { Badge } from '@/components/Badge';
import TruncatedText from '@/components/TruncatedText';
import { IconCalendarClock, IconInfoCircleFilled, IconSchool, IconTargetArrow, IconUsersGroup } from '@tabler/icons-react';
import { Alert } from '@/components/Alert';

const SubcourseFactRow = ({ children }: { children: React.ReactNode }) => <div className="flex gap-x-4">{children}</div>;

type SubcourseDataProps = {
    course: Pick<Course, 'name' | 'image' | 'description' | 'category'> & { shared?: boolean; tags: Pick<Course_Tag, 'name'>[] };
    subcourse: Pick<Subcourse, 'maxParticipants' | 'participantsCount' | 'minGrade' | 'maxGrade' | 'cancelled' | 'published' | 'publishedAt'> &
        Partial<Pick<Subcourse, 'isOnWaitingList' | 'isParticipant' | 'canJoin'>> & {
            instructors: Pick<Instructor, 'firstname' | 'lastname'>[];
            lectures: Pick<Lecture, 'start' | 'duration'>[];
        };
    isInPast: boolean;
    hideTrafficStatus?: boolean;
};

const SubcourseData: React.FC<SubcourseDataProps> = ({ course, subcourse, isInPast, hideTrafficStatus = false }) => {
    const { t, i18n } = useTranslation();
    const userType = useUserType();

    const seatsLeft: number = useMemo(() => {
        return subcourse?.maxParticipants - subcourse?.participantsCount;
    }, [subcourse?.maxParticipants, subcourse?.participantsCount]);

    const trafficStatus: TrafficStatus = useMemo(() => {
        return getTrafficStatus(subcourse?.participantsCount, subcourse?.maxParticipants);
    }, [subcourse?.maxParticipants, subcourse?.participantsCount]);

    const today = new Date();
    const aWeekAgo = today.setDate(today.getDate() - 7);
    const isCourseNewlyAdded = subcourse?.publishedAt ? new Date(subcourse?.publishedAt).getTime() > aWeekAgo : false;
    const isHomeworkHelp = course?.category === Course_Category_Enum.HomeworkHelp;
    const showTrafficStatus =
        !isInPast &&
        !subcourse?.cancelled &&
        subcourse?.published &&
        !subcourse.isOnWaitingList &&
        !hideTrafficStatus &&
        !subcourse?.isParticipant &&
        !isHomeworkHelp;

    return (
        <div className="flex flex-col-reverse lg:flex-row justify-between">
            <div className="flex flex-col gap-y-4 w-full lg:w-1/2">
                <div className="flex flex-row gap-x-3 mt-4 lg:mt-0">
                    {isCourseNewlyAdded && (
                        <Badge>
                            <Typography variant="sm" className="text-white">
                                {t('dashboard.helpers.badges.new')}
                            </Typography>
                        </Badge>
                    )}
                    {course?.tags?.map(({ name }) => (
                        <Badge key={name}>
                            <Typography variant="sm" className="text-white">
                                {name}
                            </Typography>
                        </Badge>
                    ))}
                </div>
                <Typography variant="h2" className="max-w-full">
                    {course?.name}
                </Typography>
                <div className="mb-6">
                    <TruncatedText asChild maxLines={3}>
                        <Typography className="whitespace-break-spaces">{course?.description}</Typography>
                    </TruncatedText>
                </div>
                <div className="flex flex-col gap-y-4">
                    {!(course?.category === Course_Category_Enum.HomeworkHelp) && subcourse?.lectures.length > 0 && (
                        <SubcourseFactRow>
                            <IconCalendarClock />
                            <Typography>
                                {t('single.global.clockFrom')} {Utility.formatDate(subcourse?.lectures[0]?.start, undefined, i18n.language)}{' '}
                                {t('single.global.clock')}
                            </Typography>
                        </SubcourseFactRow>
                    )}
                    {subcourse?.instructors && subcourse?.instructors[0] && !isHomeworkHelp && (
                        <SubcourseFactRow>
                            <IconSchool />
                            <Typography>{subcourse?.instructors.map((it) => `${it.firstname} ${it.lastname}`).join(' • ')}</Typography>
                        </SubcourseFactRow>
                    )}
                    {isHomeworkHelp && (
                        <SubcourseFactRow>
                            <IconSchool />
                            <Typography>{t('course.alternatingInstructors')}</Typography>
                        </SubcourseFactRow>
                    )}
                    <SubcourseFactRow>
                        <IconTargetArrow />
                        <Typography>
                            <span>{t('single.courseInfo.grade')}</span>
                            <span className="font-bold">
                                {t('single.courseInfo.class', { minGrade: getGradeLabel(subcourse?.minGrade), maxGrade: getGradeLabel(subcourse?.maxGrade) })}
                            </span>
                        </Typography>
                    </SubcourseFactRow>
                    {showTrafficStatus && (
                        <SubcourseFactRow>
                            <IconUsersGroup />
                            <div className="flex items-center gap-x-2">
                                {getTrafficLampText(
                                    trafficStatus,
                                    ['student', 'screener'].includes(userType),
                                    subcourse?.maxParticipants,
                                    subcourse?.participantsCount,
                                    seatsLeft
                                )}
                                <div className={`size-3 rounded-full ${getTrafficLampColor(trafficStatus)}`} />
                            </div>
                        </SubcourseFactRow>
                    )}
                </div>
                {(subcourse?.cancelled || isInPast) && (
                    <Alert className="w-full lg:w-fit mt-4" icon={<IconInfoCircleFilled />}>
                        {!subcourse?.cancelled && isInPast && t('single.courseInfo.courseInPast')}
                        {subcourse.cancelled && t('single.courseInfo.courseCancelled')}
                    </Alert>
                )}
                {userType === 'pupil' &&
                    !subcourse.isParticipant &&
                    Date.now() >= Date.parse(subcourse.lectures[0].start) &&
                    !isInPast &&
                    subcourse?.canJoin?.allowed && (
                        <Alert className="w-full lg:w-fit mt-4" icon={<IconInfoCircleFilled />}>
                            {t('single.courseInfo.courseStartedButJoinable')}
                        </Alert>
                    )}
                {userType === 'screener' && course?.shared && <Typography>{t('single.courseInfo.is_shared')}</Typography>}
            </div>

            <div className="lg:ml-11">
                <img alt={course?.name} className="w-[460px] h-56 rounded-lg object-cover" src={course?.image!} />
            </div>
        </div>
    );
};

export default SubcourseData;
