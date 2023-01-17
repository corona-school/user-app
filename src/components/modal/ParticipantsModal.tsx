import { Box, Text, Modal, ScrollView, Button } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Participant } from './Participant';
import ParticipantBox from './ParticipantBox';

type ModalProps = {
    organizers?: Participant[];
    participants?: Participant[];
    declinedBy?: number[];
};

const ParticipantsModal: React.FC<ModalProps> = ({ organizers, participants, declinedBy }) => {
    const [showParticipantsModal, setShowParticipantsModal] = useState<boolean>(true);
    const { t } = useTranslation();

    const sort = (toSort: Participant[], sortBy: Participant[]) => {
        return toSort.sort((a, b) => {
            if (sortBy?.includes(a)) return 1;
            if (sortBy?.includes(b)) return -1;
            return 0;
        });
    };
    const sortUserByParticipation = () => {
        const organizersCanceled = organizers?.filter((organizer) => declinedBy?.includes(organizer.id));
        const participantsCanceled = participants?.filter((participant) => declinedBy?.includes(participant.id));
        const organizersSorted = sort(organizers || [], organizersCanceled || []);
        const participantsSorted = sort(participants || [], participantsCanceled || []);
        return organizersSorted?.concat(participantsSorted || []);
    };

    const attendeesSorted = sortUserByParticipation();

    // TODO add <Modal> to AppointmentList
    return (
        <Modal mt="200" isOpen={showParticipantsModal} backgroundColor="transparent" onClose={() => setShowParticipantsModal(false)}>
            <Modal.Content width="350" marginX="auto" background="primary.900">
                <Modal.CloseButton />
                <Modal.Body background="primary.900">
                    <Box>
                        <Text color="white" py="4">
                            {t('appointments.participantsModal.title')}
                        </Text>
                    </Box>
                    <Box maxH="380">
                        <ScrollView>
                            <Box mt="2">
                                {attendeesSorted?.map((attendee) => {
                                    const declined = declinedBy?.includes(attendee.id);
                                    return (
                                        <ParticipantBox name={`${attendee.firstname} ${attendee.lastname}`} userType={attendee.userType} declined={declined} />
                                    );
                                })}
                            </Box>
                        </ScrollView>
                        <Button mt="2" onPress={() => setShowParticipantsModal(false)}>
                            {t('appointments.participantsModal.closeButton')}
                        </Button>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default ParticipantsModal;
