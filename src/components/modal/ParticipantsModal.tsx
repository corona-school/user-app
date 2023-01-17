import { Box, Text, Modal } from 'native-base';
import { Participant } from './Participants';
import ParticipantsModalContent from './ParticipantsModalContent';

type ModalProps = {
    organizers?: Participant[];
    participants?: Participant[];
};

const ParticipantsModal: React.FC<ModalProps> = ({ organizers, participants }) => {
    const sortParticipants = (participants: Participant[]) => {
        return participants.sort((a: any, b: any) => {
            return a.declined - b.declined;
        });
    };

    const sortedParticipants = sortParticipants(participants || []);
    const sortedOrganizers = sortParticipants(organizers || []);

    return (
        <Modal isOpen mt="300" backgroundColor="transparent">
            <Modal.Content width="350" marginX="auto" background="primary.900">
                <Modal.CloseButton />
                <Modal.Body background="primary.900">
                    <Box>
                        <Text color="white">Teilnehmer</Text>
                    </Box>
                    <Box maxH="380">
                        <ParticipantsModalContent organizers={sortedOrganizers} participants={sortedParticipants} />
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default ParticipantsModal;
