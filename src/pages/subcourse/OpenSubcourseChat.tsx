import { useMutation } from '@apollo/client';
import { Button, Tooltip } from 'native-base';
import { useTranslation } from 'react-i18next';
import { gql } from '../../gql';
import { useNavigate } from 'react-router-dom';

type OpenSubcourseChatProps = {
    subcourseId: number;
    conversationId: string | null | undefined;
    participantsCount: number;
    refresh: () => void;
};

const OpenSubcourseChat: React.FC<OpenSubcourseChatProps> = ({ conversationId, subcourseId, participantsCount, refresh }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [createSubcourseGroupChat] = useMutation(
        gql(`
            mutation createGroupChat($subcourseId: Float!) {
                subcourseGroupChatCreate(subcourseId: $subcourseId)
            }
        `)
    );

    const openSubcourseGroupChat = async () => {
        if (conversationId !== null) {
            console.log('extisting', conversationId);
            navigate('/chat', { state: { conversationId: conversationId } });
        } else {
            const conversation = await createSubcourseGroupChat({ variables: { subcourseId: subcourseId ?? 1 } });
            console.log('new', conversation?.data?.subcourseGroupChatCreate);
            navigate('/chat', { state: { conversationId: conversation?.data?.subcourseGroupChatCreate } });
        }
    };

    return (
        <>
            <Tooltip maxWidth={300} label={t('chat.hint')}>
                <Button onPress={openSubcourseGroupChat} isDisabled={participantsCount <= 2}>
                    {t('chat.openSubcourseChat')}
                </Button>
            </Tooltip>
        </>
    );
};

export default OpenSubcourseChat;
