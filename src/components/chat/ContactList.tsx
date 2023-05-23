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
    contactReason: ContactReasons;
};
export type ContactReasons = 'course' | 'match' | 'prospect' | 'participant';

const myContacts = gql(`
query me {
	myContactOptions {
    user {
      userID
      firstname
      lastname
    }
  	contactReason
    chatId
  }
}`);

const matcheeChatMutation = gql(`
mutation createMatcheeChat($matcheeId: String!) {
  matchChatCreate(matcheeUserId: $matcheeId)
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
    // TODO add mutation to create a convo

    const getCoursePartnerReason = (reason: ContactReasons) => {
        if (reason === 'course' && userType === 'pupil') return t('chat.instructor');
        if (reason === 'course' && userType === 'student') return t('chat.participant');
        if (reason === 'prospect') return t('chat.prospect');
        if (reason === 'match') return t('chat.matchee');
    };

    const renderContacts = ({ item: contact, index }: { item: Contact; index: number }) => {
        return (
            <>
                <Pressable
                    onPress={() => {
                        createMatcheeChat({ variables: { matcheeId: contact.user.userID } });
                        closeModal(false);
                    }}
                    _hover={{ backgroundColor: 'primary.100' }}
                >
                    <Box m="2" justifyContent="center">
                        <Stack direction="row" space={space['1']} padding="1">
                            {userType === 'student' ? <PupilAvatar /> : <StudentAvatar />}
                            <VStack space={space['0.5']}>
                                <Heading fontSize="sm">{contact.user.firstname + ' ' + contact.user.lastname}</Heading>
                                <Text fontSize="xs">{getCoursePartnerReason(contact.contactReason)}</Text>
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
