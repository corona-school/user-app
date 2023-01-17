import { Box, Text, Modal, ScrollView, Button } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Attendee } from './Attendee';
import ParticipantBox from './AttendeeBox';

type ModalProps = {
    organizers?: Attendee[];
    participants?: Attendee[];
    declinedBy?: number[];
};

const AttendeesModal: React.FC<ModalProps> = ({ organizers, participants, declinedBy }) => {
    const [showModal, setShowModal] = useState<boolean>(true);
    const { t } = useTranslation();

    const sort = (toSort: Attendee[], sortBy: Attendee[]) => {
        return toSort.sort((a, b) => {
            if (sortBy?.includes(a)) return 1;
            if (sortBy?.includes(b)) return -1;
            return 0;
        });
    };
    const sortAttendeesByParticipation = (attendeesToSort: Attendee[], declinedBy: number[]) => {
        const attendeeCanceled = attendeesToSort?.filter((attendeee) => declinedBy?.includes(attendeee.id));
        const attendeesSorted = sort(attendeesToSort || [], attendeeCanceled || []);
        return attendeesSorted;
    };

    const organizersSorted = sortAttendeesByParticipation(organizers || [], declinedBy || []);
    const participantsSorted = sortAttendeesByParticipation(participants || [], declinedBy || []);

    // TODO add <Modal> to AppointmentList
    return (
        <Modal mt="200" isOpen={showModal} backgroundColor="transparent" onClose={() => setShowModal(false)}>
            <Modal.Content width="350" marginX="auto" background="primary.900">
                <Modal.CloseButton />
                <Modal.Body background="primary.900">
                    <Box>
                        <Text color="white" py="4">
                            {t('appointments.attendeesModal.title')}
                        </Text>
                    </Box>
                    <Box maxH="380">
                        <ScrollView>
                            <Box mt="2">
                                {organizersSorted?.map((organizer) => {
                                    const declined = declinedBy?.includes(organizer.id);
                                    return <ParticipantBox name={`${organizer.firstname} ${organizer.lastname}`} userType={'student'} declined={declined} />;
                                })}
                                {participantsSorted?.map((participant) => {
                                    const declined = declinedBy?.includes(participant.id);
                                    return <ParticipantBox name={`${participant.firstname} ${participant.lastname}`} userType={'pupil'} declined={declined} />;
                                })}
                            </Box>
                        </ScrollView>
                        <Button mt="2" onPress={() => setShowModal(false)}>
                            {t('appointments.attendeesModal.closeButton')}
                        </Button>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default AttendeesModal;
