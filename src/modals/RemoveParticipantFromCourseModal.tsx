import { Button, Modal, Text, Stack, useTheme, Heading, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { SubcourseParticipant } from '../types/lernfair/Course';
import { getSchoolTypeKey } from '../types/lernfair/SchoolType';

type RemoveParticipantFromCourseModalProps = {
    participant: SubcourseParticipant | undefined;
    removeParticipantFromCourse: (pupilId: number) => void;
};

const RemoveParticipantFromCourseModal: React.FC<RemoveParticipantFromCourseModalProps> = ({ participant, removeParticipantFromCourse }) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('single.removeParticipantFromCourseModal.header')}</Modal.Header>
                <Modal.Body>
                    {participant && (
                        <VStack marginBottom={space['1.5']} alignItems="left">
                            <Heading fontSize="md">
                                {participant.firstname} {participant.lastname}
                            </Heading>
                            <Text>
                                {participant.schooltype && `${getSchoolTypeKey(participant.schooltype)}, `}
                                {participant.grade}
                            </Text>
                        </VStack>
                    )}
                    <Stack space={space['0.5']} direction="column" width="full" justifyContent="center">
                        <Button onPress={() => removeParticipantFromCourse(participant?.id || -1)}>
                            {t('single.removeParticipantFromCourseModal.remove')}
                        </Button>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default RemoveParticipantFromCourseModal;
