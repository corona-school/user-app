import { useMutation } from '@apollo/client';
import { Button, Tooltip } from 'native-base';
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

const OpenSubcourseChat: React.FC<OpenSubcourseChatProps> = ({ groupChatType, conversationId, subcourseId, participantsCount, refresh }) => {
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
            navigate('/chat', { state: { conversationId: conversation?.data?.subcourseGroupChatCreate } });
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

export default OpenSubcourseChat;
