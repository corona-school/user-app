import { useMutation } from '@apollo/client';
import { Button, Tooltip, useToast } from 'native-base';
import { useTranslation } from 'react-i18next';
import { gql } from '../../gql';
import { useNavigate } from 'react-router-dom';
import { Chat_Type } from '../../gql/graphql';

type OpenSubcourseChatProps = {
    groupChatType: Chat_Type;
    subcourseId: number;
    conversationId: string | null | undefined;
    participantsCount: number;
    refresh: () => void;
};

const OpenCourseChatButton: React.FC<OpenSubcourseChatProps> = ({ groupChatType, conversationId, subcourseId, participantsCount, refresh }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();

    const [createSubcourseGroupChat, { error }] = useMutation(
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
            if (conversation && !error) {
                navigate('/chat', { state: { conversationId: conversation?.data?.subcourseGroupChatCreate } });
            } else if (error) {
                toast.show({
                    description: groupChatType === Chat_Type.Announcement ? t('chat.announcementChatError') : t('chat.groupChatError'),
                    placement: 'top',
                });
            }
        }
    };

    return (
        <>
            <Tooltip maxWidth={300} label={t('chat.hint')}>
                <Button onPress={openSubcourseGroupChat} isDisabled={participantsCount < 2}>
                    {groupChatType === Chat_Type.Announcement ? t('chat.openAnnouncementChat') : t('chat.openSubcourseChat')}
                </Button>
            </Tooltip>
        </>
    );
};

export default OpenCourseChatButton;
