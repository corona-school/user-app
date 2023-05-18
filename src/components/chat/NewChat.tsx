import { Box, Divider, FlatList, Heading, Pressable, Stack, Text, VStack, useTheme } from 'native-base';
import myContacts, { Contact, ContactReasons, Roles } from './dummy-contacts';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_64.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student_64.svg';

const NewChat = () => {
    const { space } = useTheme();
    // TODO list all conversations, which a user can start, depending on contact options
    // TODO add query to get my contacts
    // TODO add mutation to create a convo

    const getCoursePartnerReason = (reason: ContactReasons, role: Roles) => {
        if (reason === 'course' && role === 'student') return 'Kursleiter:in';
        if (reason === 'course' && role === 'pupil') return 'Kursteilnehmer:in';
        if (reason === 'prospect') return 'Interessent:in';
        if (reason === 'match') return 'Lernpartner:in';
    };

    const renderContacts = ({ item: contact, index }: { item: Contact; index: number }) => {
        return (
            <>
                <Pressable onPress={() => console.log('create new chat')} _hover={{ backgroundColor: 'primary.100' }}>
                    <Box m="2" justifyContent="center">
                        <Stack direction="row" space={space['1']} padding="1">
                            {contact.role === 'pupil' ? <PupilAvatar /> : <StudentAvatar />}
                            <VStack space={space['0.5']}>
                                <Heading fontSize="sm">{contact.firstname + ' ' + contact.lastname}</Heading>
                                <Text fontSize="xs">{getCoursePartnerReason(contact.reason, contact.role)}</Text>
                            </VStack>
                        </Stack>
                    </Box>
                </Pressable>
                <Divider bg="primary.100" thickness="2" />
            </>
        );
    };
    return <FlatList data={myContacts} renderItem={renderContacts} />;
};

export default NewChat;
