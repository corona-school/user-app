import { Box, Divider, FlatList, Heading, Pressable, Stack, Text, VStack, useTheme } from 'native-base';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_64.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student_64.svg';
import { useUserType } from '../../hooks/useApollo';
import { gql } from '../../gql';
import { useMutation, useQuery } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
export type Contact = {
    user: {
        userID: string;
        firstname: string;
        lastname: string;
    };
    chatId: string;
    contactReasons: ContactReasons[];
};
export type ContactReasons = 'subcourse' | 'match' | 'prospect' | 'participant';

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

type NewChatProps = {
    closeModal: Dispatch<SetStateAction<boolean>>;
};
const ContactList: React.FC<NewChatProps> = ({ closeModal }) => {
    const { space } = useTheme();
    const userType = useUserType();
    const { t } = useTranslation();

    const { data } = useQuery(myContacts);
    const [createMatcheeChat] = useMutation(matcheeChatMutation);
    const [createParticipantChat] = useMutation(participantChatMutation);
    // TODO add mutation to create a convo

    const getCoursePartnerReason = (reasons: ContactReasons[]): string[] => {
        let reasonsTranslated: string[] = [];
        if (reasons.includes('subcourse') && userType === 'pupil') reasonsTranslated.push(t('chat.instructor'));
        if (reasons.includes('subcourse') && userType === 'student') reasonsTranslated.push(t('chat.participant'));
        if (reasons.includes('match')) reasonsTranslated.push(t('chat.matchee'));
        return reasonsTranslated;
    };

    const handleContactPress = (reasons: string[]) => {
        if (reasons.includes('match')) createMatcheeChat();
        createParticipantChat();
        closeModal(false);
    };
    const renderContacts = ({ item: contact, index }: { item: Contact; index: number }) => {
        const contactReasons = getCoursePartnerReason(contact.contactReasons);

        return (
            <>
                <Pressable onPress={() => handleContactPress(contactReasons)} _hover={{ backgroundColor: 'primary.100' }}>
                    <Box m="2" justifyContent="center">
                        <Stack direction="row" space={space['1']} padding="1">
                            {userType === 'student' ? <PupilAvatar /> : <StudentAvatar />}
                            <VStack space={space['0.5']}>
                                <Heading fontSize="sm">{contact.user.firstname + ' ' + contact.user.lastname}</Heading>
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
