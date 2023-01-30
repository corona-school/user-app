import { Box, Text, Modal, ScrollView, Button } from 'native-base';
import { useTranslation } from 'react-i18next';
import { LFUser, Student } from '../../types/lernfair/User';
import ParticipantBox from './AttendeeBox';

type ModalProps = {
    organizers?: Student[];
    participants?: LFUser[];
    declinedBy?: number[];
};

const AttendeesModal: React.FC<ModalProps> = ({ organizers, participants, declinedBy }) => {
    const { t } = useTranslation();

    const sortUserDesc = (toSort: LFUser[], sortBy: LFUser[]) => {
        return toSort.sort((a, b) => {
            if (sortBy?.includes(a)) return 1;
            if (sortBy?.includes(b)) return -1;
            return 0;
        });
    };

    const sortAttendeesByParticipation = (attendeesToSort: LFUser[], declinedAttendees: number[]) => {
        const attendeesCanceled = attendeesToSort?.filter((attendeee) => declinedAttendees?.includes(attendeee.id));
        const attendeesSorted = sortUserDesc(attendeesToSort || [], attendeesCanceled || []);
        return attendeesSorted;
    };

    const organizersSorted = sortAttendeesByParticipation(organizers || [], declinedBy || []);
    const participantsSorted = sortAttendeesByParticipation(participants || [], declinedBy || []);

    // TODO add <Modal> to AppointmentList: Modal mt="200" isOpen={showModal} backgroundColor="transparent" onClose={() => setShowModal(false)} + const [showModal, setShowModal] = useState<boolean>(true);
    return (
        <>
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
                                    const userType = 'isStudent' in organizer ? 'student' : 'pupil';
                                    return <ParticipantBox name={`${organizer.firstname} ${organizer.lastname}`} userType={userType} declined={declined} />;
                                })}
                                {participantsSorted?.map((participant) => {
                                    const declined = declinedBy?.includes(participant.id);
                                    const userType = 'isStudent' in participant ? 'student' : 'pupil';
                                    return <ParticipantBox name={`${participant.firstname} ${participant.lastname}`} userType={userType} declined={declined} />;
                                })}
                            </Box>
                        </ScrollView>
                        <Button mt="2" onPress={() => console.log('close')}>
                            {t('appointments.attendeesModal.closeButton')}
                        </Button>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default AttendeesModal;
