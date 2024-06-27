import { useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Box, Button, Circle, Flex, Modal, Row, Stack, Text, useTheme, useToast, VStack } from 'native-base';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import AsNavigationItem from '../../components/AsNavigationItem';
import NotificationAlert from '../../components/notifications/NotificationAlert';
import NavigationTabs from '../../components/NavigationTabs';
import WithNavigation from '../../components/WithNavigation';
import { Match } from '../../gql/graphql';
import AlertMessage from '../../widgets/AlertMessage';
import OpenMatchRequest from '../../widgets/OpenMatchRequest';
import Matches, { MatchCard } from '../match/Matches';
import { gql } from '../../gql';
import HelpNavigation from '../../components/HelpNavigation';
import { Heading, useBreakpointValue } from 'native-base';
import DisableableButton from '../../components/DisablebleButton';
import { DEACTIVATE_PUPIL_MATCH_REQUESTS } from '../../config';

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
    const { space, sizes, colors } = useTheme();
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

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const reasonDisabled = () => {
        if (!data?.me?.pupil?.canRequestMatch?.allowed) {
            return t(`lernfair.reason.matching.pupil.${data?.me?.pupil?.canRequestMatch?.reason}` as unknown as TemplateStringsArray);
        }

        return t('lernfair.reason.matching.pupil.deactivated_tooltip');
    };

    const matchRequestCount = data?.me?.pupil?.openMatchRequestCount ?? 0;

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
                <VStack space={space['0.5']} paddingX={space['1']} width="100%" marginX="auto" maxWidth={ContainerWidth}>
                    <Heading paddingBottom={space['0.5']}>{t('matching.request.check.title')}</Heading>
                    <Text maxWidth={ContentContainerWidth} paddingBottom={space['0.5']}>
                        {t('matching.blocker.firstContent')}{' '}
                        <Link style={{ color: colors.primary[900], textDecoration: 'underline' }} target="_blank" to="/hilfebereich">
                            {t('moreInfoButton')}
                        </Link>
                    </Text>
                </VStack>
                <Box paddingX={space['1']}>
                    <NavigationTabs
                        tabs={[
                            {
                                title: t('matching.request.check.tabs.tab1'),
                                content: <Matches activeMatches={activeMatches as Match[]} />,
                            },
                            {
                                title: (
                                    <span style={{ display: 'flex' }}>
                                        {t('matching.request.check.tabs.tab2')}
                                        {matchRequestCount > 0 && (
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
                                                    new Array(matchRequestCount)
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
                    <VStack marginTop={space['1.5']}>
                        <DisableableButton
                            isDisabled={!data?.me?.pupil?.canRequestMatch?.allowed || DEACTIVATE_PUPIL_MATCH_REQUESTS === 'true'}
                            reasonDisabled={reasonDisabled()}
                            onPress={() => navigate('/request-match')}
                            width={ButtonContainer}
                        >
                            {t(
                                activeMatches?.length ? 'dashboard.helpers.buttons.requestMoreMatchesPupil' : 'dashboard.helpers.buttons.requestFirstMatchPupil'
                            )}
                        </DisableableButton>
                        {(!data?.me?.pupil?.canRequestMatch?.allowed && (
                            <AlertMessage
                                content={t(`lernfair.reason.matching.pupil.${data?.me?.pupil?.canRequestMatch?.reason}` as unknown as TemplateStringsArray)}
                            />
                        )) ||
                            (DEACTIVATE_PUPIL_MATCH_REQUESTS === 'true' && <AlertMessage content={t('lernfair.reason.matching.pupil.deactivated')} />)}
                    </VStack>
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
    );
};
export default Matching;
