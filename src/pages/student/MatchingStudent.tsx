import { gql, useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Text, VStack, Heading, Button, useTheme, useBreakpointValue, Flex, Column, Modal, useToast } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../../components/AsNavigationItem';
import Tabs from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import DissolveMatchModal from '../../modals/DissolveMatchModal';
import { LFMatch } from '../../types/lernfair/Match';
import Hello from '../../widgets/Hello';
import AlertMessage from '../../widgets/AlertMessage';
import LearningPartner from '../../widgets/LearningPartner';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import OpenMatchRequest from '../../widgets/OpenMatchRequest';

type Props = {};
const query = gql`
    query MatchingStudentOverview {
        me {
            student {
                id
                subjectsFormatted {
                    name
                }
                matches {
                    id
                    uuid
                    dissolved
                    subjectsFormatted {
                        name
                    }
                    pupil {
                        firstname
                        lastname
                        schooltype
                        grade
                    }
                    pupilEmail
                }
                canRequestMatch {
                    allowed
                    reason
                    limit
                }
                openMatchRequestCount
            }
        }
    }
`;

const MatchingStudent: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const toast = useToast();

    const [showDissolveModal, setShowDissolveModal] = useState<boolean>();
    const [focusedMatch, setFocusedMatch] = useState<LFMatch>();
    const [showCancelModal, setShowCancelModal] = useState<boolean>();
    const [toastShown, setToastShown] = useState<boolean>();

    const { data, loading } = useQuery(query);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const CardGrid = useBreakpointValue({
        base: '100%',
        lg: '48%',
    });

    const [dissolveMatch, { data: dissolveData }] = useMutation(
        gql`
            mutation dissolveMatchStudent2($matchId: Float!, $dissolveReason: Float!) {
                matchDissolve(matchId: $matchId, dissolveReason: $dissolveReason)
            }
        `,
        { refetchQueries: [{ query }] }
    );

    const [cancelMatchRequest, { loading: cancelLoading }] = useMutation(
        gql`
            mutation StudentDeleteMatchRequest {
                studentDeleteMatchRequest
            }
        `,
        { refetchQueries: [{ query }] }
    );

    const showDissolveMatchModal = useCallback((match: LFMatch) => {
        setFocusedMatch(match);
        setShowDissolveModal(true);
    }, []);

    const dissolve = useCallback(
        async (reason: string) => {
            setShowDissolveModal(false);
            trackEvent({
                category: 'matching',
                action: 'click-event',
                name: 'Helfer Matching lösen',
                documentTitle: 'Helfer Matching',
            });
            return await dissolveMatch({
                variables: {
                    matchId: focusedMatch?.id,
                    dissolveReason: parseInt(reason),
                },
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dissolveMatch, focusedMatch?.id]
    );

    const showCancelMatchRequestModal = useCallback(() => {
        setShowCancelModal(true);
    }, []);

    const cancelRequest = useCallback(async () => {
        setShowCancelModal(false);
        trackEvent({
            category: 'matching',
            action: 'click-event',
            name: 'Helfer Matching Anfrage löschen',
            documentTitle: 'Helfer Matching',
        });
        const res = (await cancelMatchRequest()) as {
            studentDeleteMatchRequest: boolean;
        };

        if (res.studentDeleteMatchRequest) {
            toast.show({ description: 'Die Anfrage wurde gelöscht' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.me?.student?.id]);

    useEffect(() => {
        if (dissolveData?.matchDissolve && !toastShown) {
            setToastShown(true);
            toast.show({ description: 'Das Match wurde aufgelöst' });
        }
    }, [dissolveData?.matchDissolve, toast, toastShown]);

    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AsNavigationItem path="matching">
            <WithNavigation headerTitle={t('matching.request.check.header')} headerContent={<Hello />}>
                {loading && <CenterLoadingSpinner />}
                {!loading && (
                    <VStack paddingX={space['1']} maxWidth={ContainerWidth} width="100%" marginX="auto">
                        <Heading paddingBottom={space['0.5']}>{t('matching.request.check.title')}</Heading>
                        <VStack space={space['0.5']}>
                            <Text paddingBottom={space['0.5']}>{t('matching.request.check.content')}</Text>

                            <Text mt="1" bold>
                                {t('matching.request.check.contentHeadline')}
                            </Text>
                            <Text paddingBottom={space['1.5']}>{t('matching.request.check.contenHeadlineContent')}</Text>

                            {(data?.me?.student?.canRequestMatch.allowed && (
                                <Button width={ButtonContainer} marginBottom={space['1.5']} onPress={() => navigate('/request-match')}>
                                    {t('matching.request.check.requestmatchButton')}
                                </Button>
                            )) || <AlertMessage content={t(`lernfair.reason.${data?.me?.student?.canRequestMatch?.reason}.matching`)} />}
                        </VStack>

                        <Tabs
                            tabs={[
                                {
                                    title: t('matching.request.check.tabs.tab1'),
                                    content: (
                                        <VStack>
                                            <Flex direction="row" flexWrap="wrap">
                                                {(data?.me?.student?.matches.length &&
                                                    data?.me?.student?.matches?.map((match: LFMatch, index: number) => (
                                                        <Column width={CardGrid} marginRight="15px">
                                                            <LearningPartner
                                                                key={index}
                                                                isDark={true}
                                                                name={match?.pupil?.firstname}
                                                                subjects={match?.subjectsFormatted}
                                                                status={match?.dissolved ? 'aufgelöst' : 'aktiv'}
                                                                schooltype={t(`lernfair.schooltypes.${match?.pupil?.schooltype}`)}
                                                                schoolclass={match?.pupil?.grade}
                                                                button={
                                                                    !match.dissolved && (
                                                                        <Button variant="outlinelight" onPress={() => showDissolveMatchModal(match)}>
                                                                            {t('dashboard.helpers.buttons.solveMatch')}
                                                                        </Button>
                                                                    )
                                                                }
                                                                contactMail={match?.pupilEmail}
                                                                meetingId={match?.uuid}
                                                            />
                                                        </Column>
                                                    ))) || <AlertMessage content={t('matching.request.check.noMatches')} />}
                                            </Flex>
                                        </VStack>
                                    ),
                                },
                                {
                                    title: t('matching.request.check.tabs.tab2'),
                                    content: (
                                        <VStack space={space['1']}>
                                            <VStack space={space['0.5']}>
                                                <Flex direction="row" flexWrap="wrap">
                                                    {(data?.me?.student?.openMatchRequestCount &&
                                                        new Array(data?.me?.student?.openMatchRequestCount).fill('').map((_, i) => (
                                                            <OpenMatchRequest
                                                                cancelLoading={cancelLoading}
                                                                index={i}
                                                                showCancelMatchRequestModal={showCancelMatchRequestModal}
                                                                subjects={data?.me?.student?.subjectsFormatted}
                                                                onEditRequest={() =>
                                                                    navigate('/request-match', {
                                                                        state: { edit: true },
                                                                    })
                                                                }
                                                            />
                                                        ))) || <AlertMessage content={t('matching.request.check.noMatches')} />}
                                                </Flex>
                                            </VStack>
                                        </VStack>
                                    ),
                                },
                            ]}
                        />
                    </VStack>
                )}
            </WithNavigation>

            <DissolveMatchModal
                showDissolveModal={showDissolveModal}
                onPressDissolve={async (reason: string) => {
                    return await dissolve(reason);
                }}
                onPressBack={() => setShowDissolveModal(false)}
            />
            <Modal isOpen={showCancelModal}>
                <Modal.Content>
                    <Modal.Header>{t('matching.request.check.deleteRequest')}</Modal.Header>
                    <Modal.CloseButton onPress={() => setShowCancelModal(false)} />
                    <Modal.Body>{t('matching.request.check.areyousuretodelete')}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="ghost" onPress={() => setShowCancelModal(false)}>
                            {t('matching.request.check.cancel')}
                        </Button>
                        <Button onPress={cancelRequest}>{t('matching.request.check.deleteRequest')}</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </AsNavigationItem>
    );
};
export default MatchingStudent;
