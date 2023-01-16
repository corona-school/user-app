import { Box, Text, Modal, Button, Stack } from 'native-base';
import ParticipantBox from './ParticipantBox';

type Participant = {
    firstname: string;
    lastname: string;
    userType: string;
    declined: boolean;
};

type ModalProps = {
    organizers?: Participant[];
    participants?: Participant[];
};

const ParticipantsModal: React.FC<ModalProps> = ({ organizers, participants }) => {
    return (
        <Modal isOpen mt="300" backgroundColor="transparent">
            <Modal.Content width="350" marginX="auto" background="primary.900">
                <Modal.CloseButton />
                <Modal.Body background="primary.900">
                    <Box>
                        <Text color="white">Teilnehmer</Text>
                    </Box>
                    <Stack mt="2">
                        {organizers?.map((organzier) => {
                            return <ParticipantBox name={organzier.firstname} userType={organzier.userType} declined={organzier.declined} />;
                        })}
                        {participants?.map((participant) => {
                            return <ParticipantBox name={participant.firstname} userType={participant.userType} declined={participant.declined} />;
                        })}
                    </Stack>
                    <Button mt="2">Schließen</Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default ParticipantsModal;
