import { DocumentNode, gql, useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Text, VStack, Button, useTheme, useBreakpointValue, Flex, Column, useToast, Box, Modal, Row } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../../components/AsNavigationItem';
import Tabs from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import DissolveMatchModal from '../../modals/DissolveMatchModal';
import { LFMatch } from '../../types/lernfair/Match';
import AlertMessage from '../../widgets/AlertMessage';
import LearningPartner from '../../widgets/LearningPartner';
import OpenMatchRequest from '../../widgets/OpenMatchRequest';
import MatchingOnboarding from './MatchingOnboarding';

type Props = {};

const query: DocumentNode = gql`
    query PupilMatching {
        me {
            pupil {
                subjectsFormatted {
                    name
                }
                openMatchRequestCount
                id
                matches {
                    id
                    dissolved
                    subjectsFormatted {
                        name
                    }
                    student {
                        firstname
                        lastname
                    }
                }
                canRequestMatch {
                    allowed
                    reason
                    limit
                }
            }
        }
    }
`;

const Matching: React.FC<Props> = () => {
    const { trackPageView, trackEvent } = useMatomo();
    const { space } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const toast = useToast();
    const { data } = useQuery(query);

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDissolveModal, setShowDissolveModal] = useState<boolean>();
    const [focusedMatch, setFocusedMatch] = useState<LFMatch>();
    const [showCancelModal, setShowCancelModal] = useState<boolean>();
    const [toastShown, setToastShown] = useState<boolean>();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const CardGrid = useBreakpointValue({
        base: '100%',
        lg: '48%',
    });

    const [dissolveMatch, { data: dissolveData }] = useMutation(
        gql`
            mutation dissolveMatchPupil2($matchId: Float!, $dissolveReason: Float!) {
                matchDissolve(matchId: $matchId, dissolveReason: $dissolveReason)
            }
        `,
        { refetchQueries: [{ query }] }
    );

    const [cancelMatchRequest, { loading: cancelLoading }] = useMutation(
        gql`
            mutation PupilDeleteMatchRequest {
                pupilDeleteMatchRequest
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
            trackEvent({
                category: 'matching',
                action: 'click-event',
                name: 'Helfer Matching lösen',
                documentTitle: 'Helfer Matching',
            });
            setShowDissolveModal(false);
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
            pupilDeleteMatchRequest: boolean;
        };

        if (res.pupilDeleteMatchRequest) {
            toast.show({ description: 'Die Anfrage wurde gelöscht' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.me?.pupil?.id]);

    useEffect(() => {
        if (dissolveData?.matchDissolve && !toastShown) {
            setToastShown(true);
            toast.show({ description: 'Das Match wurde aufgelöst' });
        }
    }, [dissolveData?.matchDissolve, toast, toastShown]);

    return (
        <>
            <AsNavigationItem path="matching">
                <WithNavigation headerTitle={t('matching.request.check.header')}>
                    <MatchingOnboarding onRequestMatch={() => navigate('/request-match')} />
                    <Box paddingX={space['1']}>
                        <Tabs
                            tabs={[
                                {
                                    title: t('matching.request.check.tabs.tab1'),
                                    content: (
                                        <VStack>
                                            <Flex direction="row" flexWrap="wrap">
                                                {(data?.me?.pupil?.matches.length &&
                                                    data?.me?.pupil?.matches?.map((match: LFMatch, index: number) => (
                                                        <Column width={CardGrid} marginRight="15px">
                                                            <LearningPartner
                                                                key={index}
                                                                isDark={true}
                                                                name={`${match?.student?.firstname} ${match?.student?.lastname}`}
                                                                subjects={match?.subjectsFormatted}
                                                                status={match?.dissolved ? 'aufgelöst' : 'aktiv'}
                                                                button={
                                                                    !match.dissolved && (
                                                                        <Button variant="outlinelight" onPress={() => showDissolveMatchModal(match)}>
                                                                            {t('dashboard.helpers.buttons.solveMatch')}
                                                                        </Button>
                                                                    )
                                                                }
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
                                                    {(data?.me?.pupil?.openMatchRequestCount &&
                                                        new Array(data?.me?.pupil?.openMatchRequestCount)
                                                            .fill('')
                                                            .map((_, i) => (
                                                                <OpenMatchRequest
                                                                    cancelLoading={cancelLoading}
                                                                    index={i}
                                                                    showCancelMatchRequestModal={showCancelMatchRequestModal}
                                                                    subjects={data?.me?.pupil?.subjectsFormatted}
                                                                    onEditRequest={() => setShowEditModal(true)}
                                                                />
                                                            ))) || <AlertMessage content={t('matching.request.check.noMatches')} />}
                                                </Flex>
                                            </VStack>
                                        </VStack>
                                    ),
                                },
                            ]}
                        />
                    </Box>
                    <DissolveMatchModal
                        showDissolveModal={showDissolveModal}
                        onPressDissolve={async (reason: string) => {
                            await dissolve(reason);
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
                    <Modal isOpen={showEditModal}>
                        <Modal.Content>
                            <Modal.CloseButton />
                            <Modal.Header>Anfrage bearbeiten</Modal.Header>
                            <Modal.Body>
                                <Text>
                                    Wenn du deine Angaben änderst, verändert sich deine Wartezeit nicht. Wir informieren dich per E-Mail sobald du an der Reihe
                                    bist und wir eine:n passende:n Lernpartner:in für dich gefunden haben.
                                </Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <Row>
                                    <Button onPress={() => setShowEditModal(false)} variant={'secondary-light'}>
                                        Abbrechen
                                    </Button>
                                    <Button
                                        onPress={() =>
                                            navigate('/request-match', {
                                                state: { edit: true },
                                            })
                                        }
                                    >
                                        Bearbeiten
                                    </Button>
                                </Row>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                </WithNavigation>
            </AsNavigationItem>
        </>
    );
};
export default Matching;
