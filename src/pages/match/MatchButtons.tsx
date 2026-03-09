import { Button } from '@/components/Button';
import { gql } from '@/gql';
import { Dissolve_Reason, SingleMatchQuery } from '@/gql/graphql';
import { pupilIdToUserId, studentIdToUserId } from '@/helper/chat-helper';
import { useUserType } from '@/hooks/useApollo';
import AdHocMeetingModal from '@/modals/AdHocMeetingModal';
import DissolveMatchModal from '@/modals/DissolveMatchModal';
import ReportMatchModal from '@/modals/ReportMatchModal';
import { useMutation } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { toast } from 'sonner';
import { IconAlertTriangle, IconMessage, IconUnlink, IconVideo } from '@tabler/icons-react';
import { logError } from '@/log';

interface MatchButtonsProps {
    match?: SingleMatchQuery['match'];
    isLoading?: boolean;
    refresh: () => Promise<any>;
}

const CREATE_MATCH_CHAT_MUTATION = gql(`
    mutation createMatcheeChat($matcheeId: String!) {
    matchChatCreate(matcheeUserId: $matcheeId)
    }
`);

const DISSOLVE_MATCH_MUTATION = gql(`
    mutation dissolveMatchStudent2($matchId: Int!, $dissolveReasons: [dissolve_reason!]!, $otherFreeText: String) {
        matchDissolve(info: { matchId: $matchId, dissolveReasons: $dissolveReasons, otherDissolveReason: $otherFreeText})
    }
`);

export const MatchButtons = ({ match, isLoading, refresh }: MatchButtonsProps) => {
    const { t } = useTranslation();
    const userType = useUserType();
    const navigate = useNavigate();
    const { trackEvent } = useMatomo();
    const [showDissolveModal, setShowDissolveModal] = useState(false);
    const [showAdHocMeetingModal, setShowAdHocMeetingModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const [createMatcheeChat, { loading: isCreatingChat }] = useMutation(CREATE_MATCH_CHAT_MUTATION);
    const [dissolveMatch, { loading: isDissolvingMatch }] = useMutation(DISSOLVE_MATCH_MUTATION);

    const openChatContact = async () => {
        let contactId: string = '';
        if (userType === 'student' && match?.pupil.id) contactId = pupilIdToUserId(match?.pupil.id);
        if (userType === 'pupil' && match?.student.id) contactId = studentIdToUserId(match?.student.id);
        const conversation = await createMatcheeChat({ variables: { matcheeId: contactId } });
        navigate('/chat', { state: { conversationId: conversation?.data?.matchChatCreate } });
    };
    const dissolve = async (reasons: Dissolve_Reason[], otherFreeText: string | undefined) => {
        try {
            setShowDissolveModal(false);
            trackEvent({
                category: 'matching',
                action: 'click-event',
                name: 'Helfer Matching lösen',
                documentTitle: 'Helfer Matching',
            });
            const dissolved = await dissolveMatch({
                variables: {
                    matchId: match?.id || 0,
                    dissolveReasons: reasons,
                    otherFreeText,
                },
            });
            dissolved && (await refresh());
            toast.success(t('matching.shared.dissolved'));
        } catch (error: any) {
            toast.success(t('error'));
            logError('DissolveMatch', error.message, error);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-col gap-y-2 md:flex-row gap-x-2">
                    {match?.isChatActive && (
                        <Button
                            className="md:max-w-[270px] w-full"
                            isLoading={isCreatingChat || isLoading}
                            variant="secondary"
                            onClick={openChatContact}
                            leftIcon={<IconMessage size={20} />}
                        >
                            {t('matching.shared.contactViaChat')}
                        </Button>
                    )}
                    {userType === 'student' && !match?.dissolved && (
                        <Button
                            className="md:max-w-[270px] w-full"
                            isLoading={isLoading}
                            onClick={() => setShowAdHocMeetingModal(true)}
                            variant="outline"
                            leftIcon={<IconVideo size={20} />}
                        >
                            {t('matching.shared.directCall')}
                        </Button>
                    )}
                </div>
                <div className="flex gap-x-2">
                    {!match?.dissolved && (
                        <Button
                            className="md:max-w-[270px] w-full"
                            isLoading={isLoading}
                            variant="tertiary"
                            onClick={() => setShowReportModal(true)}
                            leftIcon={<IconAlertTriangle className="size-4 md:size-5" />}
                        >
                            {t('matching.shared.reportProblem')}
                        </Button>
                    )}
                    {!match?.dissolved && (
                        <Button
                            className="px-3 md:px-4 md:max-w-[270px] w-full"
                            variant="tertiary"
                            onClick={() => setShowDissolveModal(true)}
                            leftIcon={<IconUnlink className="size-4 md:size-5" />}
                            isLoading={isDissolvingMatch || isLoading}
                        >
                            {t('matching.shared.dissolveMatch')}
                        </Button>
                    )}
                </div>
            </div>
            <DissolveMatchModal
                showDissolveModal={showDissolveModal}
                alsoShowWarningModal={match?.createdAt && new Date(match?.createdAt).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 14}
                onPressDissolve={async (reasons: Dissolve_Reason[], otherFreeText: string | undefined) => {
                    return await dissolve(reasons, otherFreeText);
                }}
                onPressBack={() => setShowDissolveModal(false)}
                matchName={userType === 'student' ? match?.pupil.firstname : match?.student.firstname}
            />
            {match?.id && <AdHocMeetingModal onOpenChange={setShowAdHocMeetingModal} isOpen={showAdHocMeetingModal} matchId={match.id} />}
            {match?.pupil.firstname && match?.student.firstname && (
                <ReportMatchModal
                    matchName={userType === 'student' ? match?.pupil.firstname : match?.student.firstname}
                    matchId={match?.id}
                    onOpenChange={setShowReportModal}
                    isOpen={showReportModal}
                />
            )}
        </>
    );
};
