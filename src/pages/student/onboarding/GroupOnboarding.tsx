import { useToast } from 'native-base';
import { useCallback, useMemo, useState } from 'react';
import ConfirmationModal from '../../../modals/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import OnboardingCard from '../../../widgets/OnboardingCard';
import IconGroup from '../../../assets/icons/Icon_Gruppe.svg';
import LFImageGroupOnboarding from '../../../assets/images/course/group-onboarding.png';
import LFImageGroupHorizontal from '../../../assets/images/course/group-onboarding-horizontal.png';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from './../../../gql';
import GroupRequestedInfos from './GroupRequestedInfos';
import GroupOnboardingInfos from './GroupOnboardingInfos';
import WithNavigation from '../../../components/WithNavigation';
import AsNavigationItem from '../../../components/AsNavigationItem';
import NotificationAlert from '../../../components/notifications/NotificationAlert';
import CenterLoadingSpinner from '../../../components/CenterLoadingSpinner';
import { useUser } from '../../../hooks/useApollo';
import { createStudentScreeningLink } from '../../../helper/screening-helper';
import { getTrafficStatus, getTrafficStatusText, sortByDate } from '@/Utility';
import { Course_Category_Enum } from '@/gql/graphql';
import { Typography } from '@/components/Typography';
import AppointmentCard from '@/widgets/AppointmentCard';
import { useNavigate } from 'react-router-dom';
import { useJoinCourseAsMentor } from '@/hooks/useJoinCourseAsMentor';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';

type OnboardingProps = {
    // if student was screened, he can request role of TUTOR, if not screened, button does not appear
    canRequest?: boolean;
    // student has requested role INSTRUCTOR -> banner appears
    waitForSupport?: boolean;
    loading?: boolean;
    refetch?: () => void;
};

const HOMEWORK_HELP_COURSES = gql(`
    query HomeworkHelpCourses {
        subcoursesPublic(take: 10, search: "Hausaufgabenhilfe") {
            id
            published
            cancelled
            minGrade
            maxGrade
            participantsCount
            maxParticipants
            isMentor
            firstLecture {
                start
                duration
            }
            nextLecture {
                start
                duration
            }
            lectures {
                start
                duration
            }
            course {
                name
                courseState
                description
                image
                category
                tags {
                    id
                    name
                }
            }
        }
    }
`);

const GroupOnboarding: React.FC<OnboardingProps> = ({ canRequest = false, waitForSupport = false, loading, refetch }) => {
    const { t } = useTranslation();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const user = useUser();
    const navigate = useNavigate();
    const { data, loading: isLoadingCourses } = useQuery(HOMEWORK_HELP_COURSES, { fetchPolicy: 'no-cache' });

    const [contactSupport] = useMutation(
        gql(`
        mutation StudentGroupContactSupport($subject: String! $message: String!) { 
	        userContactSupport(message: { subject: $subject message: $message })
        }
    `)
    );
    const [becomeInstructor] = useMutation(gql(`mutation becomeInstructor {meBecomeInstructor}`));

    const sendMessage = useCallback(async () => {
        const res = await contactSupport({
            variables: {
                subject: 'Interesse an Kursleitung!',
                message: 'Hallo, ich habe Interesse an der Kursleitung!',
            },
        });
        const becameInstructor = await becomeInstructor();
        if (res.data?.userContactSupport && becameInstructor) {
            setIsModalOpen(false);
            toast.show({ description: t('introduction.toast.success'), placement: 'top' });
            refetch && refetch();
        } else {
            toast.show({ description: t('introduction.toast.fail'), placement: 'top' });
        }
    }, [becomeInstructor, contactSupport, t, toast]);

    const student_url = createStudentScreeningLink({
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
    });

    const [homeworkHelpSubcourse] = useMemo(
        () => sortByDate(data?.subcoursesPublic?.filter((subcourse) => subcourse.course.category === Course_Category_Enum.HomeworkHelp)),
        [data?.subcoursesPublic]
    );

    const {
        confirmationModal: confirmationToJoinAsMentor,
        joinAsMentor,
        isJoiningCourse,
    } = useJoinCourseAsMentor({
        subcourseId: homeworkHelpSubcourse?.id || 0,
        onSuccess: () => navigate(`/single-course/${homeworkHelpSubcourse?.id}`),
    });

    return (
        <AsNavigationItem path="group">
            <WithNavigation headerTitle={t('matching.group.helper.header')} headerLeft={<NotificationAlert />}>
                {(loading || isLoadingCourses) && <CenterLoadingSpinner />}
                {!loading && (
                    <>
                        {homeworkHelpSubcourse && (
                            <div className="md:px-10 mb-4">
                                {!homeworkHelpSubcourse.isMentor && (
                                    <Alert className="w-full lg:w-fit mt-4 p-8">
                                        <Typography variant="h5">{t('dashboard.homeworkhelp.catcherHelper')}</Typography>
                                        <Typography className="block mb-4 mt-6">{t('matching.homeworkhelp.texthelper')}</Typography>
                                        <Button className="w-full md:w-[200px]" onClick={joinAsMentor} isLoading={isJoiningCourse}>
                                            {t('single.signIn.homeworkHelpButton')}
                                        </Button>
                                    </Alert>
                                )}
                                {homeworkHelpSubcourse.isMentor && (
                                    <div>
                                        <Typography variant="h4" className="mb-4">
                                            {t('dashboard.homeworkhelp.title')}
                                        </Typography>
                                        <AppointmentCard
                                            subcourseId={homeworkHelpSubcourse.id}
                                            description={homeworkHelpSubcourse.course.description}
                                            tags={[]}
                                            dateNextLecture={homeworkHelpSubcourse.nextLecture?.start}
                                            image={homeworkHelpSubcourse.course.image ?? undefined}
                                            title={homeworkHelpSubcourse.course.name}
                                            countCourse={homeworkHelpSubcourse.lectures.length}
                                            maxParticipants={homeworkHelpSubcourse.maxParticipants}
                                            participantsCount={homeworkHelpSubcourse.participantsCount}
                                            minGrade={homeworkHelpSubcourse.minGrade}
                                            maxGrade={homeworkHelpSubcourse.maxGrade}
                                            statusText={getTrafficStatusText(homeworkHelpSubcourse)}
                                            isFullHeight
                                            showCourseTraffic
                                            courseCategory={homeworkHelpSubcourse.course.category}
                                            duration={homeworkHelpSubcourse?.nextLecture?.duration ?? undefined}
                                            trafficLightStatus={getTrafficStatus(
                                                homeworkHelpSubcourse.participantsCount || 0,
                                                homeworkHelpSubcourse.maxParticipants || 0
                                            )}
                                            onPressToCourse={() =>
                                                homeworkHelpSubcourse.isMentor ? navigate(`/single-course/${homeworkHelpSubcourse.id}`) : joinAsMentor()
                                            }
                                            showSchoolclass
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <OnboardingCard
                            headline={t('introduction.groupCourses')}
                            description={t('introduction.courseTypes.groupCourses')}
                            bulletPoints={waitForSupport ? GroupRequestedInfos : GroupOnboardingInfos}
                            cardImage={LFImageGroupOnboarding}
                            mobileCardImage={LFImageGroupHorizontal}
                            Icon={IconGroup}
                            showRequestButton={canRequest}
                            showRequestBanner={waitForSupport}
                            requestButtonText={t('introduction.becomeAnInstructor')}
                            bannerHeadline={t('introduction.banner.instuctorTitle')}
                            onRequest={() => setIsModalOpen(true)}
                            onTalkToTeam={() => window.open(student_url, '_blank')}
                            onMoreInfos={() => window.open('https://www.lern-fair.de/helfer/gruppenkurse', '_blank')}
                        />
                    </>
                )}

                <ConfirmationModal
                    headline={t('introduction.modal.headline')}
                    confirmButtonText={t('introduction.modal.buttonInstructor')}
                    description={t('introduction.modal.desc')}
                    onOpenChange={setIsModalOpen}
                    isOpen={isModalOpen}
                    onConfirm={() => sendMessage()}
                />
                {confirmationToJoinAsMentor}
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default GroupOnboarding;
