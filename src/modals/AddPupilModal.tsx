import { Button, Modal, Text, Stack, useTheme, Row, Column, Heading, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { PupilOnWaitinglist } from '../types/lernfair/Course';
import { getSchoolTypeKey } from '../types/lernfair/SchoolType';

type JoinPupilModalProps = {
    pupil: PupilOnWaitinglist | undefined;
    addPupilToCourse: (pupilId: number) => void;
};

const AddPupilModal: React.FC<JoinPupilModalProps> = ({ pupil, addPupilToCourse }) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('single.joinPupilModal.header')}</Modal.Header>
                <Modal.Body>
                    {pupil && (
                        <VStack marginBottom={space['1.5']} alignItems="left">
                            <Heading fontSize="md">
                                {pupil.firstname} {pupil.lastname}
                            </Heading>
                            <Text>
                                {pupil.schooltype && `${getSchoolTypeKey(pupil.schooltype)}, `}
                                {pupil.grade}
                            </Text>
                        </VStack>
                    )}
                    <Stack space={space['0.5']} direction="column" width="full" justifyContent="center">
                        <Button onPress={() => addPupilToCourse(pupil ? pupil.id : 0)}>{t('single.joinPupilModal.add')}</Button>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default AddPupilModal;
