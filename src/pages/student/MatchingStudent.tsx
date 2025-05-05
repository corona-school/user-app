import { useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Circle, Flex, Heading, Stack, Text, useBreakpointValue, useTheme, useToast, VStack } from 'native-base';
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
import OpenMatchRequest from '../../widgets/OpenMatchRequest';
import Matches, { MatchCard } from '../match/Matches';
import SwitchLanguageButton from '../../components/SwitchLanguageButton';
import { gql } from '../../gql';
import ConfirmationModal from '@/modals/ConfirmationModal';
import { Breadcrumb } from '@/components/Breadcrumb';
import TruncatedText from '@/components/TruncatedText';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

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
        const res = await cancelMatchRequest();
        if (res.data?.studentDeleteMatchRequest) {
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

    const matchRequestCount = data?.me?.student?.openMatchRequestCount ?? 0;

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
                {loading && <CenterLoadingSpinner />}
                {!loading && (
                    <VStack paddingX={space['1']} maxWidth={ContainerWidth} width="100%" marginX="auto">
                        <Breadcrumb />
                        <Heading paddingBottom={space['0.5']}>{t('matching.request.check.title')}</Heading>
                        <VStack space={space['0.5']} paddingBottom={space['0.5']} alignItems={'flex-start'} maxWidth={ContentContainerWidth}>
                            <TruncatedText asChild maxLines={2}>
                                <Typography>{t('matching.request.check.content')}</Typography>
                            </TruncatedText>
                        </VStack>
                        <NavigationTabs
                            tabs={[
                                {
                                    title: t('matching.request.check.tabs.tab1'),
                                    content: (
                                        <VStack>
                                            <Matches activeMatches={activeMatches as Match[]} />
                                            <VStack marginY={['2.5']}>
                                                {(data?.me?.student?.canRequestMatch.allowed && (
                                                    <Button className={'w-full md:w-fit'} variant={'secondary'} onClick={() => navigate('/request-match')}>
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
                                                                key={i}
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
                                <VStack marginBottom={space['2.5']}>
                                    <Button
                                        className={'w-full md:w-fit'}
                                        onClick={() => window.open(process.env.REACT_APP_HOMEWORKHELP, '_blank')}
                                        variant={'outline'}
                                    >
                                        {t('matching.homeworkhelp.button')}
                                    </Button>
                                </VStack>
                            </VStack>
                        )}
                        <VStack space={space['0.5']} paddingX={space['1']} width="100%" marginX="auto" maxWidth={ContainerWidth}>
                            <Heading paddingBottom={space['0.5']}>{t('matching.volunteering.title')}</Heading>
                            <Text maxWidth={ContentContainerWidth} paddingBottom={space['0.5']}>
                                {t('matching.volunteering.text')}
                            </Text>
                            <VStack marginBottom={space['2.5']}>
                                <Button className={'w-full md:w-fit'} onClick={() => navigate('/certificates')} variant={'outline'}>
                                    {t('matching.volunteering.button')}
                                </Button>
                            </VStack>
                        </VStack>
                    </VStack>
                )}
            </WithNavigation>
            <ConfirmationModal
                isOpen={!!showCancelModal}
                onOpenChange={setShowCancelModal}
                confirmButtonText={t('matching.request.check.deleteRequest')}
                headline={t('matching.request.check.deleteRequest')}
                description={t('matching.request.check.areyousuretodelete')}
                onConfirm={cancelRequest}
                variant="destructive"
            />
        </AsNavigationItem>
    );
};
export default MatchingStudent;
