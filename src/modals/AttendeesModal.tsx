import { Box, Text, Modal, ScrollView, Button } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AttendanceStatus } from '../types/lernfair/User';
import AttendeeBox from '../components/appointment/AttendeeBox';
import { AppointmentParticipant, Organizer } from '../gql/graphql';
import { AttendeesDeclined } from '../types/lernfair/Appointment';

type ModalProps = {
    organizers: Organizer[];
    participants: AppointmentParticipant[];
    declinedBy: number[];
    onClose?: () => void;
};

function mapToIds(declinedAttendees: AttendeesDeclined[]): number[] {
    return declinedAttendees.map((a) => a.id);
}

const AttendeesModal: React.FC<ModalProps> = ({ organizers, participants, declinedBy, onClose }) => {
    const { t } = useTranslation();

    const sortedOrganizers = organizers && declinedBy && [...organizers].sort((a, b) => declinedBy.indexOf(a.id) - declinedBy.indexOf(b.id));
    const sortedParticipants =
        participants && declinedBy && [...participants].sort((a, b) => declinedBy.indexOf(a.id ? a.id : 0) - declinedBy.indexOf(b.id ? b.id : 0));

    return (
        <>
            <Modal.Content width="350" background="primary.900">
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
                                {sortedOrganizers?.map((organizer) => {
                                    return (
                                        <AttendeeBox
                                            name={`${organizer.firstname} ${organizer.lastname}`}
                                            isOrganizer={true}
                                            declined={declinedBy?.includes(organizer.id) ? AttendanceStatus.DECLINED : AttendanceStatus.ACCEPTED}
                                        />
                                    );
                                })}
                                {sortedParticipants?.map((participant) => {
                                    return (
                                        <AttendeeBox
                                            name={`${participant.firstname} ${participant.lastname}`}
                                            declined={
                                                declinedBy?.includes(participant.id ? participant.id : 0)
                                                    ? AttendanceStatus.DECLINED
                                                    : AttendanceStatus.ACCEPTED
                                            }
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
