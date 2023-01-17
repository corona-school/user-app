import { Box, Button, ScrollView } from 'native-base';
import ParticipantBox from './ParticipantBox';
import { Participant } from './Participants';

type ModalProps = {
    organizers?: Participant[];
    participants?: Participant[];
};

const ParticipantsModalContent: React.FC<ModalProps> = ({ organizers, participants }) => {
    return (
        <>
            <ScrollView>
                <Box mt="2">
                    {organizers?.map((organizer) => {
                        return (
                            <ParticipantBox
                                name={organizer.firstname.concat(' ', organizer.lastname)}
                                userType={organizer.userType}
                                declined={organizer.declined}
                            />
                        );
                    })}
                    {participants?.map((participant) => {
                        return (
                            <ParticipantBox
                                name={participant.firstname.concat(' ' + participant.lastname)}
                                userType={participant.userType}
                                declined={participant.declined}
                            />
                        );
                    })}
                </Box>
            </ScrollView>
            <Button mt="2">Schließen</Button>
        </>
    );
};

export default ParticipantsModalContent;
