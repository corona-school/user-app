import { useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Box, Button, Flex, Modal, Row, Stack, Text, useTheme, useToast, VStack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../../components/AsNavigationItem';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import Tabs from '../../components/Tabs';
import WithNavigation from '../../components/WithNavigation';
import { Match } from '../../gql/graphql';
import AlertMessage from '../../widgets/AlertMessage';
import OpenMatchRequest from '../../widgets/OpenMatchRequest';
import Matches from '../match/Matches';
import MatchingOnboarding from './MatchingOnboarding';
import { gql } from '../../gql';
import HelpNavigation from '../../components/HelpNavigation';

type Props = {};

const query = gql(`
    query PupilMatching {
        me {
            pupil {
                id
                subjectsFormatted {
                    name
                    mandatory
                }
                openMatchRequestCount
                matches {
                    id
                    uuid
                    dissolved
                    subjectsFormatted {
                        name
                    }
                    pupil {
                        schooltype
                        grade
                    }
                    student {
                        firstname
                        lastname
                    }
                    studentEmail
                }
                canRequestMatch {
                    allowed
                    reason
                    limit
                }
            }
        }
    }
`);

const Matching: React.FC<Props> = () => {
    const { trackPageView, trackEvent } = useMatomo();
    const { space } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const toast = useToast();
    const { data } = useQuery(query);

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showCancelModal, setShowCancelModal] = useState<boolean>();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [cancelMatchRequest, { loading: cancelLoading }] = useMutation(
        gql(`
            mutation PupilDeleteMatchRequest {
                pupilDeleteMatchRequest
            }
        `),
        { refetchQueries: [{ query }] }
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
            toast.show({ description: t('matching.request.check.deleteSucess'), placement: 'top' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.me?.pupil?.id]);

    const activeMatches = useMemo(() => {
        return data?.me?.pupil?.matches.filter((match) => match.dissolved === false);
    }, [data?.me?.pupil?.matches]);

    const inactiveMatches = useMemo(() => {
        return data?.me?.pupil?.matches.filter((match) => match.dissolved === true);
    }, [data?.me?.pupil?.matches]);

    return (
        <>
            <AsNavigationItem path="matching">
                <WithNavigation
                    headerTitle={t('matching.request.check.header')}
                    headerLeft={
                        <Stack alignItems="center" direction="row">
                            <HelpNavigation />
                            <NotificationAlert />
                        </Stack>
                    }
                >
                    <MatchingOnboarding onRequestMatch={() => navigate('/request-match')} />
                    <Box paddingX={space['1']}>
                        <Tabs
                            tabs={[
                                {
                                    title: t('matching.request.check.tabs.tab1'),
                                    content: <Matches activeMatches={activeMatches as Match[]} inactiveMatches={inactiveMatches as Match[]} />,
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
                                                                    key={i}
                                                                    showCancelMatchRequestModal={showCancelMatchRequestModal}
                                                                    subjects={data?.me?.pupil?.subjectsFormatted || []}
                                                                    onEditRequest={() => setShowEditModal(true)}
                                                                />
                                                            ))) || <AlertMessage content={t('matching.request.check.noRequestsTutee')} />}
                                                </Flex>
                                            </VStack>
                                        </VStack>
                                    ),
                                },
                            ]}
                        />
                    </Box>
                    <Modal isOpen={showCancelModal}>
                        <Modal.Content>
                            <Modal.Header>{t('matching.request.check.deleteRequest')}</Modal.Header>
                            <Modal.CloseButton onPress={() => setShowCancelModal(false)} />
                            <Modal.Body>{t('matching.request.check.areyousuretodelete')}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="ghost" onPress={() => setShowCancelModal(false)}>
                                    {t('cancel')}
                                </Button>
                                <Button onPress={cancelRequest}>{t('matching.request.check.deleteRequest')}</Button>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                    <Modal isOpen={showEditModal}>
                        <Modal.Content>
                            <Modal.CloseButton />
                            <Modal.Header>{t('matching.request.check.editRequest')}</Modal.Header>
                            <Modal.Body>
                                <Text>{t('matching.request.check.editRequestDescription')}</Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <Row>
                                    <Button onPress={() => setShowEditModal(false)} variant={'secondary-light'}>
                                        {t('cancel')}
                                    </Button>
                                    <Button
                                        onPress={() =>
                                            navigate('/request-match', {
                                                state: { edit: true },
                                            })
                                        }
                                    >
                                        {t('edit')}
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
