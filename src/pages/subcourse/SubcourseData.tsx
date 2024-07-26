import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tag from '../../components/Tag';
import { Course, Course_Tag, Instructor, Lecture, Subcourse } from '../../gql/graphql';
import { useUserType } from '../../hooks/useApollo';
import { TrafficStatus } from '../../types/lernfair/Course';
import Utility, { getGradeLabel, getTrafficStatus } from '../../Utility';
import AlertMessage from '../../widgets/AlertMessage';
import CourseTrafficLamp from '../../widgets/CourseTrafficLamp';
import { Typography } from '@/components/atoms/Typography';

type SubcourseDataProps = {
    course: Pick<Course, 'name' | 'image'> & { shared?: boolean; tags: Pick<Course_Tag, 'name'>[] };
    subcourse: Pick<Subcourse, 'maxParticipants' | 'participantsCount' | 'minGrade' | 'maxGrade' | 'cancelled' | 'published'> &
        Partial<Pick<Subcourse, 'isOnWaitingList' | 'isParticipant' | 'canJoin'>> & {
            instructors: Pick<Instructor, 'firstname' | 'lastname'>[];
            lectures: Pick<Lecture, 'start' | 'duration'>[];
        };
    isInPast: boolean;
    hideTrafficStatus?: boolean;
};

const SubcourseData: React.FC<SubcourseDataProps> = ({ course, subcourse, isInPast, hideTrafficStatus = false }) => {
    const { t } = useTranslation();
    const userType = useUserType();

    const seatsLeft: number = useMemo(() => {
        return subcourse?.maxParticipants - subcourse?.participantsCount;
    }, [subcourse?.maxParticipants, subcourse?.participantsCount]);

    const trafficStatus: TrafficStatus = useMemo(() => {
        return getTrafficStatus(subcourse?.participantsCount, subcourse?.maxParticipants);
    }, [subcourse?.maxParticipants, subcourse?.participantsCount]);

    return (
        <div className="flex flex-col-reverse md:flex-row justify-between">
            <div className="flex flex-col gap-y-4 w-full md:w-1/2">
                <div className="flex flex-row gap-x-3">
                    {course?.tags?.map(({ name }) => (
                        <Tag text={name} />
                    ))}
                </div>
                <Typography variant="h2" className="max-w-full">
                    {course?.name}
                </Typography>
                {subcourse?.lectures.length > 0 && (
                    <Typography>
                        {t('single.global.clockFrom')} {Utility.formatDate(subcourse?.lectures[0]?.start)} {t('single.global.clock')}
                    </Typography>
                )}
                {subcourse?.instructors && subcourse?.instructors[0] && (
                    <Typography variant="h4">{subcourse?.instructors.map((it) => `${it.firstname} ${it.lastname}`).join(' • ')}</Typography>
                )}
                <Typography className="max-w-2xl">
                    <Typography className="font-bold" as="span">
                        {t('single.courseInfo.grade')}
                    </Typography>
                    {t('single.courseInfo.class', { minGrade: getGradeLabel(subcourse?.minGrade), maxGrade: getGradeLabel(subcourse?.maxGrade) })}
                </Typography>
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
                {userType === 'screener' && course?.shared && <Typography>{t('single.courseInfo.is_shared')}</Typography>}
            </div>

            <div>
                <img alt={course?.name} className="w-[570px] h-56 rounded-lg object-cover" src={course?.image!} />
            </div>
        </div>
    );
};

export default SubcourseData;
