import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OnboardingCard from '../../../widgets/OnboardingCard';
import { Box, Circle, FlatList, HStack, Modal, Text, useTheme, useToast } from 'native-base';
import CourseConfirmationModal from '../../../modals/CourseConfirmationModal';
import MatchIcon from '../../../assets/icons/Icon_Einzel.svg';
import OneToOneImage from '../../../assets/images/matching/1-1-onboarding.png';
import OneToOneMobileImage from '../../../assets/images/matching/1-1-onboarding-mobile.png';
import i18next from 'i18next';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from './../../../gql';
import AsNavigationItem from '../../../components/AsNavigationItem';
import WithNavigation from '../../../components/WithNavigation';
import Hello from '../../../widgets/Hello';
import NotificationAlert from '../../../components/notifications/NotificationAlert';
import CenterLoadingSpinner from '../../../components/CenterLoadingSpinner';

const matchTexts: string[] = [
    i18next.t('introduction.matchDescription.first'),
    i18next.t('introduction.matchDescription.second'),
    i18next.t('introduction.matchDescription.third'),
    i18next.t('introduction.matchDescription.fourth'),
];

type MatchProps = {
    // if student was screened, he can request role of TUTOR, if not screened, button does not appear
    canRequest?: boolean;
    // if student has requested role TUTOR a banner appears
    waitForSupport?: boolean;
    loading?: boolean;
    refetch?: () => void;
};

const query = gql(`
query GetMeData {
    me { 
        email
        firstname
        lastname
    }
}
`);

const MatchOnboarding: React.FC<MatchProps> = ({ canRequest = false, waitForSupport = false, loading, refetch }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { data } = useQuery(query);

    const matchBulletPoints: React.FC = () => {
        return (
            <FlatList
                data={matchTexts}
                renderItem={({ item }) => (
                    <HStack space={space['1']} mb={space['1']}>
                        <Circle backgroundColor="black" size="4px" mt={2} />
                        <Text numberOfLines={3}>{item}</Text>
                    </HStack>
                )}
            />
        );
    };

    const [contactSupport] = useMutation(
        gql(`
        mutation StudentMatchContactSupport($subject: String! $message: String!) { 
	        userContactSupport(message: { subject: $subject message: $message })
        }
    `)
    );

    const [becomeTutor] = useMutation(gql(`mutation becomeTutor {meBecomeTutor}`));

    const sendMessage = useCallback(async () => {
        const res = await contactSupport({
            variables: {
                subject: 'Interesse an der 1:1-Lernunterstützung!',
                message: 'Hallo, ich habe Interesse an der Lernunterstützung!',
            },
        });

        const becameTutor = await becomeTutor();

        if (res.data?.userContactSupport && becameTutor) {
            setIsModalOpen(false);
            toast.show({ description: t('introduction.toast.success'), placement: 'top' });
            refetch && refetch();
        } else {
            toast.show({ description: t('introduction.toast.fail'), placement: 'top' });
        }
    }, [becomeTutor, contactSupport, t, toast]);

    const student_url =
        process.env.REACT_APP_SCREENING_URL +
        '?first_name=' +
        encodeURIComponent(data?.me?.firstname ?? '') +
        '&last_name=' +
        encodeURIComponent(data?.me?.lastname ?? '') +
        '&email=' +
        encodeURIComponent(data?.me?.email ?? '');

    return (
        <AsNavigationItem path="matching">
            <WithNavigation headerContent={<Hello />} headerTitle={t('matching.group.helper.header')} headerLeft={<NotificationAlert />}>
                {loading && <CenterLoadingSpinner />}

                {!loading && (
                    <Box justifyContent="center" alignItems="center">
                        <OnboardingCard
                            headline={t('introduction.match')}
                            description={t('introduction.courseTypes.oneToOneLearningSupport')}
                            bulletPoints={matchBulletPoints}
                            cardImage={OneToOneImage}
                            mobileCardImage={OneToOneMobileImage}
                            Icon={MatchIcon}
                            showRequestButton={canRequest}
                            showRequestBanner={waitForSupport}
                            requestButtonText={t('introduction.becomeTutor')}
                            bannerHeadline={t('introduction.banner.tutorTitle')}
                            onRequest={() => setIsModalOpen(true)}
                            onTalkToTeam={() => window.open(student_url, '_blank')}
                            onMoreInfos={() => window.open('https://www.lern-fair.de/helfer/now', '_blank')}
                        />
                    </Box>
                )}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <CourseConfirmationModal
                        headline={t('introduction.modal.headline')}
                        confirmButtonText={t('introduction.modal.buttonTutor')}
                        description={t('introduction.modal.desc')}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={() => sendMessage()}
                    />
                </Modal>
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default MatchOnboarding;
