import { Box, Button, Divider, Heading, Stack, useTheme, useToast } from 'native-base';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import MatchPartner from './match/MatchPartner';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql/gql';
import { useUserType } from '../hooks/useApollo';
import { Pupil, Student } from '../gql/graphql';
import { useCallback, useEffect, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import DissolveMatchModal from '../modals/DissolveMatchModal';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import AlertMessage from '../widgets/AlertMessage';
import HelpNavigation from '../components/HelpNavigation';
import MatchAppointments from '../widgets/MatchAppointments';
import { Appointment } from '../types/lernfair/Appointment';
import AppointmentCreation from './create-appointment/AppointmentCreation';
import { pupilIdToUserId, studentIdToUserId } from '../helper/chat-helper';
import AsNavigationItem from '../components/AsNavigationItem';

export const singleMatchQuery = gql(`
query SingleMatch($matchId: Int! ) {
  match(matchId: $matchId){
    id
    uuid
    dissolved
    dissolveReason
    pupil {
        id
        firstname
        lastname
        schooltype
        grade
        state
        subjectsFormatted {
            name
        }
        aboutMe
    }
    pupilEmail
    student {
        id
        firstname
        lastname
        state
        subjectsFormatted {
            name
        }
        aboutMe
    }
    studentEmail
    appointments {
        id
            title
            description
            start
            duration
            appointmentType
            total
            position
            displayName
            isOrganizer
            isParticipant
            organizers(skip: 0, take: 5) {
                id
                firstname
                lastname
            }
            participants(skip: 0, take: 10) {
                id
                firstname
                lastname
            }
        }
  }
}`);

const matchChatMutation = gql(`
mutation createMatcheeChat($matcheeId: String!) {
  matchChatCreate(matcheeUserId: $matcheeId)
}
`);

const SingleMatch = () => {
    const { trackEvent } = useMatomo();
    const { id: _matchId } = useParams();
    const matchId = parseInt(_matchId ?? '', 10);
    const { space } = useTheme();
    const { isMobile } = useLayoutHelper();
    const { t } = useTranslation();
    const userType = useUserType();
    const toast = useToast();
    const [showDissolveModal, setShowDissolveModal] = useState<boolean>();
    const [toastShown, setToastShown] = useState<boolean>();
    const [createAppointment, setCreateAppointment] = useState<boolean>(false);

    const navigate = useNavigate();

    const { data, loading, error, refetch } = useQuery(singleMatchQuery, {
        variables: {
            matchId,
        },
    });

    const [createMatcheeChat] = useMutation(matchChatMutation);

    const [dissolveMatch, { data: dissolveData }] = useMutation(
        gql(`
            mutation dissolveMatchStudent2($matchId: Float!, $dissolveReason: Float!) {
                matchDissolve(matchId: $matchId, dissolveReason: $dissolveReason)
            }
        `)
    );

    const dissolve = useCallback(
        async (reason: string) => {
            setShowDissolveModal(false);
            trackEvent({
                category: 'matching',
                action: 'click-event',
                name: 'Helfer Matching lösen',
                documentTitle: 'Helfer Matching',
            });
            const dissolved = await dissolveMatch({
                variables: {
                    matchId: matchId || 0,
                    dissolveReason: parseInt(reason),
                },
            });
            dissolved && refetch();
        },
        [dissolveMatch, matchId, refetch, trackEvent]
    );

    const appointments = data?.match?.appointments ?? [];

    const goBackToMatch = async () => {
        await refetch();
        setCreateAppointment(false);
    };

    const openChatContact = async () => {
        let contactId: string = '';
        if (userType === 'student' && data?.match?.pupil.id) contactId = pupilIdToUserId(data?.match?.pupil.id);
        if (userType === 'pupil' && data?.match?.student.id) contactId = studentIdToUserId(data?.match?.student.id);
        const conversation = await createMatcheeChat({ variables: { matcheeId: contactId } });
        navigate('/chat', { state: { conversationId: conversation?.data?.matchChatCreate } });
    };

    useEffect(() => {
        if (dissolveData?.matchDissolve && !toastShown) {
            setToastShown(true);
            toast.show({ description: t('matching.shared.dissolved'), placement: 'top' });
        }
    }, [dissolveData?.matchDissolve, toast, toastShown]);

    return (
        <AsNavigationItem path="matching">
            <WithNavigation
                headerTitle={''}
                showBack={!createAppointment}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
            >
                {loading || !data ? (
                    <CenterLoadingSpinner />
                ) : (
                    !error && (
                        <Stack space={space['1']} paddingX={space['1.5']} mb={space[1.5]}>
                            {createAppointment ? (
                                <AppointmentCreation
                                    back={() => setCreateAppointment(false)}
                                    courseOrMatchId={matchId}
                                    isCourse={false}
                                    appointmentsTotal={appointments.length}
                                    navigateToMatch={async () => await goBackToMatch()}
                                />
                            ) : (
                                <>
                                    {userType === 'student' ? (
                                        <MatchPartner partner={(data?.match?.pupil as Pupil) || {}} isPupil />
                                    ) : (
                                        <MatchPartner partner={(data?.match?.student as Student) || {}} />
                                    )}

                                    {data?.match?.dissolved && (
                                        <Stack direction={isMobile ? 'column' : 'row'} justifyContent="center" space={isMobile ? space['0.5'] : space['3']}>
                                            <AlertMessage
                                                content={t('matching.shared.dissolvedAlert', {
                                                    partnerName: userType === 'student' ? data?.match?.pupil?.firstname : data?.match?.student?.firstname,
                                                })}
                                            />
                                        </Stack>
                                    )}

                                    <Stack
                                        direction={isMobile ? 'column' : 'row'}
                                        flexWrap={isMobile ? 'nowrap' : 'wrap'}
                                        justifyContent="center"
                                        space={isMobile ? space['0.5'] : space['2']}
                                    >
                                        <Button
                                            onPress={() =>
                                                (window.location.href = `mailto:${
                                                    userType === 'student' ? data!.match!.pupilEmail : data!.match!.studentEmail
                                                }`)
                                            }
                                            my={isMobile ? '0' : '1'}
                                        >
                                            {t('matching.shared.contactMail')}
                                        </Button>

                                        <Button onPress={() => openChatContact()} my={isMobile ? '0' : '1'}>
                                            {t('matching.shared.contactViaChat')}
                                        </Button>
                                        <Button isDisabled variant="outline" my={isMobile ? '0' : '1'}>
                                            {t('matching.shared.directCall')}
                                        </Button>
                                        {!data?.match?.dissolved && (
                                            <Button variant="outline" my={isMobile ? '0' : '1'} onPress={() => setShowDissolveModal(true)}>
                                                {t('matching.shared.dissolveMatch')}
                                            </Button>
                                        )}
                                    </Stack>
                                    <Divider thickness={1} mb={4} />
                                    <Stack space={space['1']}>
                                        <Heading>{t('matching.shared.appointmentsHeadline')}</Heading>
                                    </Stack>
                                    <MatchAppointments
                                        appointments={appointments as Appointment[]}
                                        minimumHeight={'30vh'}
                                        loading={loading}
                                        error={error}
                                        dissolved={data?.match?.dissolved}
                                    />
                                    {userType === 'student' && !data?.match?.dissolved && (
                                        <Box>
                                            <Divider thickness={1} mb={4} />
                                            <Stack direction={isMobile ? 'column' : 'row'} justifyContent="center" space={isMobile ? space['0'] : space['5']}>
                                                <Button variant="outline" onPress={() => setCreateAppointment(true)}>
                                                    {t('matching.shared.createAppointment')}
                                                </Button>
                                            </Stack>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Stack>
                    )
                )}

                <DissolveMatchModal
                    showDissolveModal={showDissolveModal}
                    onPressDissolve={async (reason: string) => {
                        return await dissolve(reason);
                    }}
                    onPressBack={() => setShowDissolveModal(false)}
                />
            </WithNavigation>
        </AsNavigationItem>
    );
};

export default SingleMatch;
