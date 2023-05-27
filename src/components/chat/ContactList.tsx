import { Box, Divider, FlatList, Heading, Pressable, Stack, Text, VStack, useTheme } from 'native-base';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_64.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student_64.svg';
import { useUserType } from '../../hooks/useApollo';
import { gql } from '../../gql';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const myContacts = gql(`
query me {
	myContactOptions {
    user {
      userID
      firstname
      lastname
    }
  	contactReasons
    chatId
  }
}`);

const matcheeChatMutation = gql(`
mutation createMatcheeChat($matcheeId: String!) {
  matchChatCreate(matcheeUserId: $matcheeId)
}
`);

const participantChatMutation = gql(`
mutation createParticipantChat($participantUserId: String!) {
    participantChatCreate(participantUserId: $participantUserId)
}
`);

export type Contact = {
    user: {
        userID: string;
        firstname: string;
        lastname: string;
    };
    chatId: string;
    contactReasons: ContactReasons[];
};
export type ContactReasons = 'subcourse' | 'match';

type NewChatProps = {
    onClose: () => void;
    setChatId: (id: string) => void;
};

const ContactList: React.FC<NewChatProps> = ({ onClose, setChatId }) => {
    const { space } = useTheme();
    const userType = useUserType();
    const { t } = useTranslation();

    const { data } = useQuery(myContacts);
    const [createMatcheeChat] = useMutation(matcheeChatMutation);
    const [createParticipantChat] = useMutation(participantChatMutation);

    const hasReason = (reason: string, reasons: string[]) => {
        if (reasons.includes(reason)) return true;
        return false;
    };
    const transformToTranslatedReasons = (reasons: ContactReasons[]): string[] => {
        let reasonsTranslated: string[] = [];

        if (hasReason('subcourse', reasons)) {
            if (userType === 'pupil') {
                reasonsTranslated.push(t('chat.instructor'));
            } else if (userType === 'student') {
                reasonsTranslated.push(t('chat.participant'));
            }
        }

        if (hasReason('match', reasons)) {
            reasonsTranslated.push(t('chat.matchee'));
        }
        return reasonsTranslated;
    };
    const handleContactPress = async (reasons: string[], contactId: string) => {
        if (hasReason('match', reasons)) {
            const conversation = await createMatcheeChat({ variables: { matcheeId: contactId } });
            setChatId(conversation.data?.matchChatCreate ?? '');
        } else {
            const conversation = await createParticipantChat({ variables: { participantUserId: contactId } });
            setChatId(conversation.data?.participantChatCreate ?? '');
        }
        onClose();
    };
    const renderContacts = ({ item: contact, index }: { item: Contact; index: number }) => {
        const contactReasons = transformToTranslatedReasons(contact.contactReasons);

        return (
            <>
                <Pressable onPress={() => handleContactPress(contact.contactReasons, contact.user.userID)} _hover={{ backgroundColor: 'primary.100' }}>
                    <Box m="2" justifyContent="center">
                        <Stack direction="row" space={space['1']} padding="1">
                            {userType === 'student' ? <PupilAvatar /> : <StudentAvatar />}
                            <VStack space={space['0.5']}>
                                <Heading fontSize="sm">{`${contact.user.firstname} ${contact.user.lastname} `}</Heading>
                                <Text fontSize="xs">{contactReasons.join(', ')}</Text>
                            </VStack>
                        </Stack>
                    </Box>
                </Pressable>
                <Divider bg="primary.100" thickness="2" />
            </>
        );
    };
    return <FlatList data={data?.myContactOptions as Contact[]} renderItem={renderContacts} />;
};

export default ContactList;
