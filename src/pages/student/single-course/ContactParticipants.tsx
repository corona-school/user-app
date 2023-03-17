import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, useBreakpointValue, useTheme, useToast } from 'native-base';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Participant } from '../../../gql/graphql';
import SendParticipantsMessageModal from '../../../modals/SendParticipantsMessageModal';
import { SelectParticipants } from '../../../widgets/SelectParticipants';

type ContactProps = {
    subcourseId: number;
    refresh: () => void;
};

const ContactParticipants: React.FC<ContactProps> = ({ subcourseId, refresh }) => {
    const toast = useToast();
    const { t } = useTranslation();
    const { sizes } = useTheme();

    const [showMessageModal, setShowMessageModal] = useState(false);

    const { data: participantsData } = useQuery(
        gql(`
        query SubcourseParticipantsForContact($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId) {
                participants { 
                    id
                    firstname
                    lastname
                }
            }
        }
    `),
        { variables: { subcourseId: subcourseId } }
    );

    const [sendMessage, _sendMessage] = useMutation(
        gql(`
            mutation sendMessage($subject: String!, $message: String!, $subcourseId: Int!, $participants: [Int!]!) {
                subcourseNotifyParticipants(subcourseId: $subcourseId, title: $subject, body: $message, participantIDs: $participants, fileIDs: [])
            }
        `)
    );

    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const onSendMessage = useCallback(
        async (subject: string, message: string) => {
            if (subject && message && participantsData) {
                try {
                    await sendMessage({
                        variables: {
                            subject,
                            message,
                            subcourseId: subcourseId,
                            participants: selectedParticipants.length
                                ? selectedParticipants
                                : participantsData.subcourse!.participants.map((it: Participant) => it.id),
                        },
                    });
                    toast.show({ description: 'Nachricht erfolgreich versendet', placement: 'top' });
                    setShowMessageModal(false);
                } catch (e) {
                    toast.show({
                        description: 'Deine Nachricht konnte nicht versendet werden',
                        placement: 'top',
                    });
                }
            }
        },
        [participantsData, sendMessage, subcourseId, selectedParticipants, toast]
    );

    return (
        <>
            <Button onPress={() => setShowMessageModal(true)} width={ButtonContainer} variant="outline">
                {t('single.contact.participants')}
            </Button>
            <SendParticipantsMessageModal
                isInstructor={true}
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                onSend={onSendMessage}
                isDisabled={_sendMessage.loading}
                details={
                    <SelectParticipants
                        participants={participantsData?.subcourse!.participants ?? []}
                        selectedParticipants={selectedParticipants}
                        setSelectedParticipants={setSelectedParticipants}
                    />
                }
            />
        </>
    );
};

export default ContactParticipants;
