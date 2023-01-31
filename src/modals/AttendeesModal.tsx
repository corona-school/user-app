import { Box, Text, Modal, ScrollView, Button } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Organizer, Participant } from '../types/lernfair/User';
import AttendeeBox from '../components/appointment/AttendeeBox';

type ModalProps = {
    organizers?: Organizer[];
    participants?: Participant[];
};

const AttendeesModal: React.FC<ModalProps> = ({ organizers, participants }) => {
    const { t } = useTranslation();

    // will get sorted organizers and participants from BE,
    // TODO add <Modal> to AppointmentList: Modal mt="200" isOpen={showModal} backgroundColor="transparent" onClose={() => setShowModal(false)} + const [showModal, setShowModal] = useState<boolean>(true);

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
                                        <AttendeeBox name={`${organizer.firstname} ${organizer.lastname}`} userType={userType} declined={organizer.status} />
                                    );
                                })}
                                {participants?.map((participant) => {
                                    const userType = 'isStudent' in participant ? 'student' : 'pupil';
                                    return (
                                        <AttendeeBox
                                            name={`${participant.firstname} ${participant.lastname}`}
                                            userType={userType}
                                            declined={participant.status}
                                        />
                                    );
                                })}
                            </Box>
                        </ScrollView>
                        <Button mt="2" onPress={() => console.log('close')}>
                            {t('appointment.attendeesModal.closeButton')}
                        </Button>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default AttendeesModal;
