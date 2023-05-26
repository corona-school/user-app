import { useMutation } from '@apollo/client';
import { Button, Tooltip } from 'native-base';
import { useTranslation } from 'react-i18next';
import { gql } from '../../gql';
import { useNavigate } from 'react-router-dom';

type OpenSubcourseChatProps = {
    subcourseId: number;
    participantsCount: number;
    refresh: () => void;
};

const OpenSubcourseChat: React.FC<OpenSubcourseChatProps> = ({ subcourseId, participantsCount, refresh }) => {
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
        const conversation = await createSubcourseGroupChat({ variables: { subcourseId: subcourseId ?? 1 } });
        navigate('/chat', { state: { conversationId: conversation?.data?.subcourseGroupChatCreate } });
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
