import { Button, Divider, Stack, useTheme, useToast } from 'native-base';
import WithNavigation from '../components/WithNavigation';
import NotificationAlert from '../components/notifications/NotificationAlert';
import { useTranslation } from 'react-i18next';
import MatchPartner from './match/MatchPartner';
import { useLayoutHelper } from '../hooks/useLayoutHelper';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from './../gql';
import {} from '../gql/gql';
import { useUserType } from '../hooks/useApollo';
import { Pupil, Student } from '../gql/graphql';
import { useCallback, useEffect, useState } from 'react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import DissolveMatchModal from '../modals/DissolveMatchModal';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import AlertMessage from '../widgets/AlertMessage';
import AppointmentCreation from './create-appointment/AppointmentCreation';

const singleMatchQuery = gql(`
query SingleMatch($matchId: Int! ) {
  match(matchId: $matchId){
    id
    uuid
    dissolved
    dissolveReason
    pupil {
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
      firstname
      lastname
      state
      subjectsFormatted {
        name
      }
      aboutMe
    }
    studentEmail
  }
}`);

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

    const { data, loading, error, refetch } = useQuery(singleMatchQuery, {
        variables: {
            matchId,
        },
    });

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

    useEffect(() => {
        if (dissolveData?.matchDissolve && !toastShown) {
            setToastShown(true);
            toast.show({ description: t('matching.shared.dissolved'), placement: 'top' });
        }
    }, [dissolveData?.matchDissolve, toast, toastShown]);

    // TODO integrate appointments
    // const tabs: Tab[] = [
    //     {
    //         title: 'Termine',
    //         content: <Text>Termine</Text>,
    //     },
    // ];

    return (
        <WithNavigation headerTitle={''} showBack={!createAppointment} headerLeft={!createAppointment ? <NotificationAlert /> : <></>}>
            {loading || !data ? (
                <CenterLoadingSpinner />
            ) : (
                !error && (
                    <Stack space={space['1']} paddingX={space['1.5']}>
                        {createAppointment ? (
                            <AppointmentCreation back={() => setCreateAppointment(false)} courseOrMatchId={matchId} isCourse={false} appointmentsTotal={0} />
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

                                <Stack direction={isMobile ? 'column' : 'row'} justifyContent="center" space={isMobile ? space['0.5'] : space['3']}>
                                    <Button
                                        onPress={() => {
                                            window.open(`https://meet.jit.si/CoronaSchool-${data?.match?.uuid}`);
                                        }}
                                    >
                                        {t('matching.shared.videochat')}
                                    </Button>
                                    <Button
                                        onPress={() =>
                                            (window.location.href = `mailto:${userType === 'student' ? data!.match!.pupilEmail : data!.match!.studentEmail}`)
                                        }
                                    >
                                        {t('matching.shared.contactMail')}
                                    </Button>

                                    <Button isDisabled variant="outline">
                                        {t('matching.shared.contactViaChat')}
                                    </Button>
                                    <Button isDisabled variant="outline">
                                        {t('matching.shared.directCall')}
                                    </Button>
                                    {!data?.match?.dissolved && (
                                        <Button variant="outline" onPress={() => setShowDissolveModal(true)}>
                                            {t('matching.shared.dissolveMatch')}
                                        </Button>
                                    )}
                                    <Divider thickness={1} my={1} />
                                    <Button variant="outline" onPress={() => setCreateAppointment(true)}>
                                        {t('matching.shared.createAppointment')}
                                    </Button>
                                </Stack>
                            </>
                        )}
                        {/* <Tabs tabs={tabs} /> */}
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
    );
};

export default SingleMatch;
