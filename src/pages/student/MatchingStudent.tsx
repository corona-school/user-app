import { useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Button, Circle, Flex, Heading, Modal, Stack, Text, useBreakpointValue, useTheme, useToast, VStack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AsNavigationItem from '../../components/AsNavigationItem';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import NavigationTabs from '../../components/NavigationTabs';
import WithNavigation from '../../components/WithNavigation';
import { Match } from '../../gql/graphql';

import AlertMessage from '../../widgets/AlertMessage';
import Hello from '../../widgets/Hello';
import OpenMatchRequest from '../../widgets/OpenMatchRequest';
import Matches, { MatchCard } from '../match/Matches';
import HelpNavigation from '../../components/HelpNavigation';
import { gql } from '../../gql';

type Props = {};
const query = gql(`
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
                        gradeAsInt
                    }
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
`);

const MatchingStudent: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const toast = useToast();
    const [showCancelModal, setShowCancelModal] = useState<boolean>();

    const { data, loading } = useQuery(query);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const [cancelMatchRequest, { loading: cancelLoading }] = useMutation(
        gql(`
            mutation StudentDeleteMatchRequest {
                studentDeleteMatchRequest
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
            studentDeleteMatchRequest: boolean;
        };

        if (res.studentDeleteMatchRequest) {
            toast.show({ description: t('matching.request.check.deleteSucess'), placement: 'top' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.me?.student?.id]);

    const activeMatches = useMemo(() => {
        return data?.me?.student?.matches.filter((match) => match.dissolved === false);
    }, [data?.me?.student?.matches]);

    const inactiveMatches = useMemo(() => {
        return data?.me?.student?.matches.filter((match) => match.dissolved === true);
    }, [data?.me?.student?.matches]);

    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const matchRequestCount = data?.me?.student?.openMatchRequestCount;

    return (
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
                {loading && <CenterLoadingSpinner />}
                {!loading && (
                    <VStack paddingX={space['1']} maxWidth={ContainerWidth} width="100%" marginX="auto">
                        <Heading paddingBottom={space['0.5']}>{t('matching.request.check.title')}</Heading>
                        <VStack space={space['0.5']}>
                            <Text paddingBottom={space['0.5']}>{t('matching.request.check.content')}</Text>
                            {(data?.me?.student?.canRequestMatch.allowed && (
                                <Button width={ButtonContainer} marginBottom={space['1.5']} onPress={() => navigate('/request-match')}>
                                    {t('dashboard.helpers.buttons.requestMatchStudent')}
                                </Button>
                            )) || (
                                <AlertMessage
                                    content={t(
                                        `lernfair.reason.matching.tutor.${data?.me?.student?.canRequestMatch?.reason}` as unknown as TemplateStringsArray
                                    )}
                                />
                            )}
                        </VStack>
                        <NavigationTabs
                            tabs={[
                                {
                                    title: t('matching.request.check.tabs.tab1'),
                                    content: <Matches activeMatches={activeMatches as Match[]} />,
                                },
                                {
                                    title: (
                                        <span style={{ display: 'flex' }}>
                                            {t('matching.request.check.tabs.tab2')}{' '}
                                            {matchRequestCount && matchRequestCount > 0 && (
                                                <Circle bgColor="danger.500" size="5">
                                                    <Text fontSize="xs" color="white">
                                                        {matchRequestCount}
                                                    </Text>
                                                </Circle>
                                            )}
                                        </span>
                                    ),
                                    content: (
                                        <VStack space={space['1']}>
                                            <VStack space={space['0.5']}>
                                                <Flex direction="row" flexWrap="wrap">
                                                    {(matchRequestCount &&
                                                        new Array(matchRequestCount).fill('').map((_, i) => (
                                                            <OpenMatchRequest
                                                                cancelLoading={cancelLoading}
                                                                index={i}
                                                                showCancelMatchRequestModal={showCancelMatchRequestModal}
                                                                subjects={data?.me?.student?.subjectsFormatted || []}
                                                                onEditRequest={() =>
                                                                    navigate('/request-match', {
                                                                        state: { edit: true },
                                                                    })
                                                                }
                                                            />
                                                        ))) || <AlertMessage content={t('matching.request.check.noRequestsTutor')} />}
                                                </Flex>
                                            </VStack>
                                        </VStack>
                                    ),
                                },
                                {
                                    title: t('matching.request.check.tabs.tab3'),
                                    content: (
                                        <VStack space={space['1.5']}>
                                            <Flex direction="row" flexWrap="wrap">
                                                {inactiveMatches && inactiveMatches.length > 0 ? (
                                                    <>
                                                        {inactiveMatches.map((match) => (
                                                            <MatchCard match={match as Match} key={match.id} />
                                                        ))}
                                                    </>
                                                ) : (
                                                    <AlertMessage content={t('matching.request.check.noDissolvedMatches')} />
                                                )}
                                            </Flex>
                                        </VStack>
                                    ),
                                },
                            ]}
                        />
                        {process.env.REACT_APP_HOMEWORKHELP !== '' && (
                            <VStack space={space['0.5']} paddingX={space['1']} width="100%" marginX="auto" maxWidth={ContainerWidth}>
                                <Heading paddingBottom={space['0.5']}>{t('matching.homeworkhelp.title')}</Heading>
                                <Text maxWidth={ContentContainerWidth} paddingBottom={space['0.5']}>
                                    {t('matching.homeworkhelp.texthelper')}
                                </Text>
                                <VStack marginBottom={space['1.5']}>
                                    <Button width={ButtonContainer} onPress={() => window.open(process.env.REACT_APP_HOMEWORKHELP, '_blank')}>
                                        {t('matching.homeworkhelp.button')}
                                    </Button>
                                </VStack>
                            </VStack>
                        )}
                    </VStack>
                )}
            </WithNavigation>
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
        </AsNavigationItem>
    );
};
export default MatchingStudent;
