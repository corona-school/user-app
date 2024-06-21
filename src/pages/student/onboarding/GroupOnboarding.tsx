import { Box, Modal, useToast } from 'native-base';
import { useCallback, useState } from 'react';
import CourseConfirmationModal from '../../../modals/CourseConfirmationModal';
import { useTranslation } from 'react-i18next';
import OnboardingCard from '../../../widgets/OnboardingCard';
import IconGroup from '../../../assets/icons/Icon_Gruppe.svg';
import LFImageGroupOnboarding from '../../../assets/images/course/group-onboarding.png';
import LFImageGroupHorizontal from '../../../assets/images/course/group-onboarding-horizontal.png';
import { useMutation } from '@apollo/client';
import { gql } from './../../../gql';
import GroupRequestedInfos from './GroupRequestedInfos';
import GroupOnboardingInfos from './GroupOnboardingInfos';
import WithNavigation from '../../../components/WithNavigation';
import AsNavigationItem from '../../../components/AsNavigationItem';
import Hello from '../../../widgets/Hello';
import NotificationAlert from '../../../components/notifications/NotificationAlert';
import CenterLoadingSpinner from '../../../components/CenterLoadingSpinner';
import { useUser } from '../../../hooks/useApollo';
import { createStudentScreeningLink } from '../../../helper/screening-helper';

type OnboardingProps = {
    // if student was screened, he can request role of TUTOR, if not screened, button does not appear
    canRequest?: boolean;
    // student has requested role INSTRUCTOR -> banner appears
    waitForSupport?: boolean;
    loading?: boolean;
    refetch?: () => void;
};

const GroupOnboarding: React.FC<OnboardingProps> = ({ canRequest = false, waitForSupport = false, loading, refetch }) => {
    const { t } = useTranslation();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const user = useUser();

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

    return (
        <AsNavigationItem path="group">
            <WithNavigation headerTitle={t('matching.group.helper.header')} headerLeft={<NotificationAlert />}>
                {loading && <CenterLoadingSpinner />}

                {!loading && (
                    <Box justifyContent="center" alignItems="center">
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
                    </Box>
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <CourseConfirmationModal
                        headline={t('introduction.modal.headline')}
                        confirmButtonText={t('introduction.modal.buttonInstructor')}
                        description={t('introduction.modal.desc')}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={() => sendMessage()}
                    />
                </Modal>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default GroupOnboarding;
