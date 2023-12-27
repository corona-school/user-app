import { useMutation } from '@apollo/client';
import { useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { gql } from '../../gql';
import { useNavigate } from 'react-router-dom';
import { Chat_Type } from '../../gql/graphql';
import { useMemo } from 'react';
import DisablebleButton from '../../components/DisablebleButton';

type OpenSubcourseChatProps = {
    groupChatType: Chat_Type;
    subcourseId: number;
    conversationId: string | null | undefined;
    participantsCount: number;
    isParticipant?: boolean;
    isInstructor?: boolean;
    refresh: () => void;
};

const OpenCourseChatButton: React.FC<OpenSubcourseChatProps> = ({
    groupChatType,
    conversationId,
    subcourseId,
    isInstructor,
    isParticipant,
    participantsCount,
    refresh,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();

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
                toast.show({
                    description: groupChatType === Chat_Type.Announcement ? t('chat.announcementChatError') : t('chat.groupChatError'),
                    placement: 'top',
                });
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
        <DisablebleButton isDisabled={disableButton} reasonDisabled={t('chat.hint')} onPress={openSubcourseGroupChat}>
            {groupChatType === Chat_Type.Announcement ? t('chat.openAnnouncementChat') : t('chat.openSubcourseChat')}
        </DisablebleButton>
    );
};

export default OpenCourseChatButton;
