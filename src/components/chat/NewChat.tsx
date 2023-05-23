import { Box, Divider, FlatList, Heading, Pressable, Stack, Text, VStack, useTheme } from 'native-base';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_64.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student_64.svg';
import { useUserType } from '../../hooks/useApollo';
import { gql } from '../../gql';
import { useQuery } from '@apollo/client';
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

const ContactQuery = gql(`
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

const NewChat = () => {
    const { space } = useTheme();
    const userType = useUserType();

    const { data } = useQuery(ContactQuery);

    // TODO add mutation to create a convo

    const getCoursePartnerReason = (reason: ContactReasons) => {
        if (reason === 'course' && userType === 'student') return 'Kursleiter:in';
        if (reason === 'course' && userType === 'pupil') return 'Kursteilnehmer:in';
        if (reason === 'prospect') return 'Interessent:in';
        if (reason === 'match') return 'Lernpartner:in';
    };

    const renderContacts = ({ item: contact, index }: { item: Contact; index: number }) => {
        return (
            <>
                <Pressable onPress={() => console.log('create new chat')} _hover={{ backgroundColor: 'primary.100' }}>
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

export default NewChat;
