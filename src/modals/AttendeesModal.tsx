import { Box, Text, Modal, ScrollView, Button } from 'native-base';
import { useTranslation } from 'react-i18next';
import { AttendanceStatus } from '../types/lernfair/User';
import AttendeeBox from '../components/appointment/AttendeeBox';
import { AttendeesDeclined } from '../types/lernfair/Appointment';
import { useMemo } from 'react';
import { AppointmentParticipant, Organizer } from '../gql/graphql';

type ModalProps = {
    organizers?: Organizer[];
    participants?: AppointmentParticipant[];
    declinedBy: AttendeesDeclined[];
    onClose?: () => void;
};

function mapToIds(declinedAttendees: AttendeesDeclined[]): string[] {
    return declinedAttendees.map((a) => a.userId);
}

const AttendeesModal: React.FC<ModalProps> = ({ organizers, participants, declinedBy, onClose }) => {
    const { t } = useTranslation();

    const declinedIds = useMemo(() => {
        return mapToIds(declinedBy);
    }, [declinedBy?.length]);

    const sortedOrganizers =
        organizers &&
        declinedBy &&
        [...organizers].sort(
            (a, b) =>
                declinedBy.findIndex((declinedAttendee) => a.userId === declinedAttendee.userId) -
                declinedBy.findIndex((declinedAttendee) => b.userId === declinedAttendee.userId)
        );

    const sortedParticipants =
        participants &&
        declinedBy &&
        [...participants].sort(
            (a, b) =>
                declinedBy.findIndex((declinedAttendee) => a.userId === declinedAttendee.userId) -
                declinedBy.findIndex((declinedAttendee) => b.userId === declinedAttendee.userId)
        );

    console.log(declinedBy);
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
                                            declined={declinedIds.includes(organizer.userId!) ? AttendanceStatus.DECLINED : AttendanceStatus.ACCEPTED}
                                        />
                                    );
                                })}
                                {sortedParticipants?.map((participant) => {
                                    return (
                                        <AttendeeBox
                                            name={`${participant.firstname} ${participant.lastname}`}
                                            declined={declinedIds.includes(participant.userId!) ? AttendanceStatus.DECLINED : AttendanceStatus.ACCEPTED}
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
