import { useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { gql } from '../../gql';
import { useNavigate } from 'react-router-dom';
import { Chat_Type } from '../../gql/graphql';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { IconMessage2 } from '@tabler/icons-react';

type OpenSubcourseChatProps = {
    groupChatType: Chat_Type;
    subcourseId: number;
    conversationId: string | null | undefined;
    participantsCount: number;
    isParticipant?: boolean;
    isInstructor?: boolean;
    refresh: () => void;
    className?: string;
};

const OpenCourseChatButton: React.FC<OpenSubcourseChatProps> = ({
    groupChatType,
    conversationId,
    subcourseId,
    isInstructor,
    isParticipant,
    participantsCount,
    refresh,
    className,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [createSubcourseGroupChat] = useMutation(
        gql(`
            mutation createNewGroupChat($subcourseId: Float!, $groupChatType: String!) {
                subcourseGroupChatCreate(subcourseId: $subcourseId, groupChatType: $groupChatType)
            }
        `)
    );

    const openSubcourseGroupChat = async () => {
        if (conversationId !== null) {
            navigate('/chat', { state: { conversationId: conversationId } });
        } else {
            const conversation = await createSubcourseGroupChat({
                variables: {
                    subcourseId: subcourseId,
                    groupChatType: groupChatType === Chat_Type.Announcement ? Chat_Type.Announcement : Chat_Type.Normal,
                },
            });
            if (conversation) {
                navigate('/chat', { state: { conversationId: conversation?.data?.subcourseGroupChatCreate } });
            } else {
                toast.error(groupChatType === Chat_Type.Announcement ? t('chat.announcementChatError') : t('chat.groupChatError'));
            }
        }
    };

    const disableButton = useMemo(() => {
        if (isParticipant && !conversationId) {
            return true;
        }
        if (isInstructor && participantsCount < 2) {
            return true;
        }
        return false;
    }, [conversationId, isInstructor, isParticipant, participantsCount]);

    return (
        <Button
            leftIcon={<IconMessage2 size={16} />}
            variant="outline"
            disabled={disableButton}
            reasonDisabled={t('chat.hint')}
            onClick={openSubcourseGroupChat}
            className={className}
        >
            {groupChatType === Chat_Type.Announcement ? t('chat.openAnnouncementChat') : t('chat.openSubcourseChat')}
        </Button>
    );
};

export default OpenCourseChatButton;
