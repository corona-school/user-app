import { useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Circle, Flex, Stack, Text, useTheme, useToast, VStack } from 'native-base';
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
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import { Heading, useBreakpointValue } from 'native-base';
import DisableableButton from '../../components/DisablebleButton';
import { DEACTIVATE_PUPIL_MATCH_REQUESTS } from '../../config';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { Breadcrumb } from '@/components/Breadcrumb';
import TruncatedText from '@/components/TruncatedText';
import { Typography } from '@/components/Typography';

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
        const res = await cancelMatchRequest();
        if (res.data?.pupilDeleteMatchRequest) {
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

    const canRequestMatch = () => {
        if (data?.me.pupil?.canRequestMatch.reason === 'no-subjects-selected') {
            return true; // pupils can still do it because they'll selected subjects before submitting the request
        }
        return data?.me.pupil?.canRequestMatch.allowed;
    };

    const matchRequestCount = data?.me?.pupil?.openMatchRequestCount ?? 0;

    return (
        <AsNavigationItem path="matching">
            <WithNavigation
                headerTitle={t('matching.request.check.header')}
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </Stack>
                }
            >
                <VStack
                    space={space['0.5']}
                    paddingX={space['1']}
                    width="100%"
                    maxWidth={ContentContainerWidth}
                    alignItems={'flex-start'}
                    paddingBottom={space['0.5']}
                >
                    <Breadcrumb />
                    <Heading paddingBottom={space['0.5']}>{t('matching.request.check.title')}</Heading>
                    <TruncatedText asChild maxLines={2}>
                        <Typography>
                            {t('matching.blocker.firstContent')}
                            <br />
                            <Link style={{ color: colors.primary[900], textDecoration: 'underline' }} target="_blank" to="/hilfebereich">
                                {t('moreInfoButton')}
                            </Link>
                        </Typography>
                    </TruncatedText>
                </VStack>
                <NavigationTabs
                    tabs={[
                        {
                            title: t('matching.request.check.tabs.tab1'),
                            content: (
                                <VStack>
                                    <Matches activeMatches={activeMatches as Match[]} />
                                    <VStack marginTop={space['1.5']}>
                                        <DisableableButton
                                            isDisabled={!canRequestMatch() || DEACTIVATE_PUPIL_MATCH_REQUESTS === 'true'}
                                            reasonDisabled={reasonDisabled()}
                                            onPress={() => navigate('/request-match')}
                                            width={ButtonContainer}
                                        >
                                            {t(
                                                activeMatches?.length
                                                    ? 'dashboard.helpers.buttons.requestMoreMatchesPupil'
                                                    : 'dashboard.helpers.buttons.requestFirstMatchPupil'
                                            )}
                                        </DisableableButton>
                                        {(!canRequestMatch() && (
                                            <AlertMessage
                                                content={t(
                                                    `lernfair.reason.matching.pupil.${data?.me?.pupil?.canRequestMatch?.reason}` as unknown as TemplateStringsArray
                                                )}
                                            />
                                        )) ||
                                            (DEACTIVATE_PUPIL_MATCH_REQUESTS === 'true' && (
                                                <AlertMessage content={t('lernfair.reason.matching.pupil.deactivated')} />
                                            ))}
                                    </VStack>
                                </VStack>
                            ),
                        },
                        {
                            title: (
                                <span style={{ display: 'flex' }}>
                                    {t('matching.request.check.tabs.tab2')}
                                    {matchRequestCount > 0 && (
                                        <Circle bgColor="danger.500" size="5" ml={2}>
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
                <ConfirmationModal
                    isOpen={!!showCancelModal}
                    onOpenChange={setShowCancelModal}
                    confirmButtonText={t('matching.request.check.deleteRequest')}
                    headline={t('matching.request.check.deleteRequest')}
                    description={t('matching.request.check.areyousuretodelete')}
                    onConfirm={cancelRequest}
                    variant="destructive"
                />
                <ConfirmationModal
                    isOpen={!!showEditModal}
                    onOpenChange={setShowEditModal}
                    confirmButtonText={t('edit')}
                    headline={t('matching.request.check.editRequest')}
                    description={t('matching.request.check.editRequestDescription')}
                    onConfirm={() =>
                        navigate('/request-match', {
                            state: { edit: true },
                        })
                    }
                />
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default Matching;
