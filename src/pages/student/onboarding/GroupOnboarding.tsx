import { Box, Modal, useToast } from 'native-base';
import { useCallback, useState } from 'react';
import CourseConfirmationModal from '../../../modals/CourseConfirmationModal';
import { useTranslation } from 'react-i18next';
import OnboardingCard from '../../../widgets/OnboardingCard';
import IconGroup from '../../../assets/icons/Icon_Gruppe.svg';
import LFImageGroupOnboarding from '../../../assets/images/course/group-onboarding.png';
import LFImageGroupHorizontal from '../../../assets/images/course/group-onboarding-horizontal.png';
import { useMutation } from '@apollo/client';
import { gql } from '../../../gql/gql';
import GroupRequestedInfos from './GroupRequestedInfos';
import GroupOnboardingInfos from './GroupOnboardingInfos';
import WithNavigation from '../../../components/WithNavigation';
import AsNavigationItem from '../../../components/AsNavigationItem';
import Hello from '../../../widgets/Hello';
import NotificationAlert from '../../../components/notifications/NotificationAlert';

type OnboardingProps = {
    // if student was screened, he can request role of TUTOR, if not screened, button does not appear
    canRequest?: boolean;
    // student has requested role INSTRUCTOR -> banner appears
    waitForSupport?: boolean;
    refetch?: () => void;
};

const GroupOnboarding: React.FC<OnboardingProps> = ({ canRequest = false, waitForSupport = false, refetch }) => {
    const { t } = useTranslation();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

    return (
        <AsNavigationItem path="group">
            <WithNavigation headerContent={<Hello />} headerTitle={t('matching.group.helper.header')} headerLeft={<NotificationAlert />}>
                <Box justifyContent="center" alignItems="center">
                    <OnboardingCard
                        headline={t('introduction.groupCourses')}
                        Description={waitForSupport ? GroupRequestedInfos : GroupOnboardingInfos}
                        cardImage={LFImageGroupOnboarding}
                        mobileCardImage={LFImageGroupHorizontal}
                        Icon={IconGroup}
                        showRequestButton={canRequest}
                        showRequestBanner={waitForSupport}
                        requestButtonText={t('introduction.becomeAnInstructor')}
                        imageText={t('introduction.imageGroupText')}
                        bannerHeadline={t('introduction.banner.instuctorTitle')}
                        onRequest={() => setIsModalOpen(true)}
                        onTalkToTeam={() => window.open('https://calendly.com/d/2fy-7hr-wrz/kennenlerngesprach', '_blank')}
                        onMoreInfos={() => window.open('https://www.lern-fair.de/helfer/gruppenkurse', '_blank')}
                    />
                </Box>

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
