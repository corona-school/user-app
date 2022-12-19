import { DocumentNode, gql, useMutation } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Text, VStack, Heading, Button, Modal, Radio, useTheme, Row, useBreakpointValue } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CancelMatchRequestModal from '../../modals/CancelMatchRequestModal';
import CTACard from '../../widgets/CTACard';
import LFGruppenLearnIcon from '../../assets/icons/lernfair/lf-books.svg';

type Props = { refetchQuery: DocumentNode };

const MatchingPending: React.FC<Props> = ({ refetchQuery }) => {
    const { space, sizes } = useTheme();
    const [showModal, setShowModal] = useState<boolean>(false);

    const { t } = useTranslation();
    const { trackPageView } = useMatomo();

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const [cancelMatchRequest, _cancelMatchRequest] = useMutation(
        gql`
            mutation cancelMatchRequest {
                pupilDeleteMatchRequest
            }
        `,
        { refetchQueries: [refetchQuery] }
    );

    const cancelMatchRequestReaction = useCallback(
        async (sendFeedback: boolean, feedback?: string) => {
            setShowModal(false);
            await cancelMatchRequest();
        },
        [cancelMatchRequest]
    );

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Pending',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ContentWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    return (
        <>
            <VStack space={space['1']} paddingX={space['1']} width="100%" marginX="auto" maxWidth={ContentContainerWidth}>
                <Heading>{t('matching.pending.header')}</Heading>
                <Text maxWidth={ContentWidth}>
                    <Text bold>{t('matching.pending.requestFrom')}</Text> 25.07.2022
                </Text>
                <Text maxWidth={ContentWidth}>
                    <Text bold>{t('matching.pending.waitingTime')}</Text> {t('matching.pending.waitingTimeMonthCa')} 3 - 6{' '}
                    {t('matching.pending.waitingTimeMonth')}e
                </Text>
                <Text maxWidth={ContentWidth}>{t('matching.pending.content')}</Text>
                <Button marginBottom={space['2']} w={buttonWidth} isDisabled={_cancelMatchRequest.loading} variant="outline" onPress={() => setShowModal(true)}>
                    {t('matching.pending.buttons.cancel')}
                </Button>

                <CTACard
                    variant="dark"
                    icon={<LFGruppenLearnIcon />}
                    title={t('matching.pending.cta.title')}
                    content={<Text>{t('matching.pending.cta.content')}</Text>}
                    button={<Button>{t('matching.pending.buttons.cta')}</Button>}
                />
            </VStack>
            <CancelMatchRequestModal
                showModal={showModal}
                onClose={() => setShowModal(false)}
                onShareFeedback={(feedback) => cancelMatchRequestReaction(true, feedback)}
                onSkipShareFeedback={() => cancelMatchRequestReaction(false)}
            />
        </>
    );
};
export default MatchingPending;
