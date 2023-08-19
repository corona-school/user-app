import { Box, Divider, FlatList, Heading, Pressable, Stack, Text, VStack, useTheme, useToast } from 'native-base';
import PupilAvatar from '../../assets/icons/lernfair/avatar_pupil_64.svg';
import StudentAvatar from '../../assets/icons/lernfair/avatar_student_64.svg';
import { useUserType } from '../../hooks/useApollo';
import { gql } from '../../gql';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import ContactEmptyState from './ContactEmptyState';
import { useCallback, useEffect } from 'react';
import CenterLoadingSpinner from '../CenterLoadingSpinner';

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

const contactChatMutation = gql(`
mutation createContactChat($contactUserId: String!) {
  contactChatCreate(contactUserId: $contactUserId)
}
`);

export type Contact = {
    user: {
        userID: string;
        firstname: string;
        lastname: string;
    };
    chatId: string;
    contactReasons: ContactReason[];
};
export enum ContactReason {
    COURSE = 'course',
    MATCH = 'match',
    ANNOUNCEMENT = 'announcement',
    PARTICIPANT = 'participant',
    PROSPECT = 'prospect',
    CONTACT = 'contact',
}

type NewChatProps = {
    onClose: () => void;
    setChatId: (id: string) => void;
};

const ContactList: React.FC<NewChatProps> = ({ onClose, setChatId }) => {
    const { space } = useTheme();
    const userType = useUserType();
    const { t } = useTranslation();
    const toast = useToast();

    const { data, loading, refetch } = useQuery(myContacts);
    const [createContactChat] = useMutation(contactChatMutation);

    const hasReason = (reason: string, reasons: string[]) => {
        return reasons.includes(reason);
    };
    const transformToTranslatedReasons = useCallback((reasons: ContactReason[]): string[] => {
        let reasonsTranslated: string[] = [];

        if (hasReason(ContactReason.COURSE, reasons)) {
            reasonsTranslated.push(userType === 'pupil' ? t('chat.instructor') : t('chat.participant'));
        }

        if (hasReason(ContactReason.MATCH, reasons)) {
            reasonsTranslated.push(t('chat.matchee'));
        }
        return reasonsTranslated;
    }, []);

    const handleContactPress = async (contactId: string) => {
        const conversation = await createContactChat({ variables: { contactUserId: contactId } });
        if (conversation) {
            setChatId(conversation.data?.contactChatCreate ?? '');
            onClose();
        } else {
            toast.show({ description: t('chat.chatError'), placement: 'top' });
        }
    };

    useEffect(() => {
        refetch();
    }, []);

    const renderContacts = ({ item: contact, index }: { item: Contact; index: number }) => {
        const contactReasons = transformToTranslatedReasons(contact.contactReasons);

        return (
            <>
                <Pressable onPress={() => handleContactPress(contact.user.userID)} _hover={{ backgroundColor: 'primary.100' }}>
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
    return (
        <>
            {loading && <CenterLoadingSpinner />}
            {!loading && data && (
                <FlatList
                    data={data?.myContactOptions as Contact[]}
                    renderItem={renderContacts}
                    ListEmptyComponent={<ContactEmptyState title={t('chat.noContactOptions')} subtitle={t('chat.noContactOptionsHint')} />}
                />
            )}
        </>
    );
};

export default ContactList;
