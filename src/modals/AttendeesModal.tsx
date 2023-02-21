import { Box, Text, Modal, ScrollView, Button } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AttendanceStatus, Participant } from '../types/lernfair/User';
import AttendeeBox from '../components/appointment/AttendeeBox';
import { Student } from '../gql/graphql';

type ModalProps = {
    organizers?: Student[];
    participants?: Participant[];
    declinedBy?: number[];
    onClose?: () => void;
};

const AttendeesModal: React.FC<ModalProps> = ({ organizers, participants, declinedBy, onClose }) => {
    const { t } = useTranslation();

    return (
        <>
            <Modal.Content width="350" marginX="auto" background="primary.900">
                <Modal.CloseButton />
                <Modal.Body background="primary.900">
                    <Box>
                        <Text color="white" py="4">
                            {t('appointment.attendeesModal.title')}
                        </Text>
                    </Box>
                    <Box maxH="380">
                        <ScrollView>
                            <Box mt="2">
                                {organizers?.map((organizer) => {
                                    const userType = 'isStudent' in organizer ? 'student' : 'pupil';

                                    return (
                                        <AttendeeBox
                                            name={`${organizer.firstname} ${organizer.lastname}`}
                                            userType={userType}
                                            declined={declinedBy?.includes(organizer.id) ? AttendanceStatus.DECLINED : AttendanceStatus.ACCEPTED}
                                        />
                                    );
                                })}
                                {participants?.map((participant) => {
                                    const userType = 'isStudent' in participant ? 'student' : 'pupil';
                                    return (
                                        <AttendeeBox
                                            name={`${participant.firstname} ${participant.lastname}`}
                                            userType={userType}
                                            declined={declinedBy?.includes(participant.id) ? AttendanceStatus.DECLINED : AttendanceStatus.ACCEPTED}
                                        />
                                    );
                                })}
                            </Box>
                        </ScrollView>
                        <Button mt="2" onPress={onClose}>
                            {t('appointment.attendeesModal.closeButton')}
                        </Button>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default AttendeesModal;
