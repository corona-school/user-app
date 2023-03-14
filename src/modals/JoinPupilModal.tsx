import { Button, Modal, Text, Stack, useTheme, Row, Column, Heading } from 'native-base';
import { useTranslation } from 'react-i18next';
import { PupilOnWaitinglist } from '../types/lernfair/Course';
import { getSchoolTypeKey } from '../types/lernfair/SchoolType';

type JoinPupilModalProps = {
    pupil: PupilOnWaitinglist | undefined;
    joinPupilToCourse: (pupilId: number) => void;
};

const JoinPupilModal: React.FC<JoinPupilModalProps> = ({ pupil, joinPupilToCourse }) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    return (
        <>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('single.joinPupilModal.header')}</Modal.Header>
                <Modal.Body>
                    {pupil && (
                        <Row marginBottom={space['1.5']} alignItems="center">
                            <Column>
                                <Heading fontSize="md">
                                    {pupil.firstname} {pupil.lastname}
                                </Heading>
                                <Text>
                                    {pupil.schooltype && `${getSchoolTypeKey(pupil.schooltype)}, `}
                                    {pupil.grade}
                                </Text>
                            </Column>
                        </Row>
                    )}
                    <Stack space={space['0.5']} direction="column" width="full" justifyContent="center">
                        <Button onPress={() => joinPupilToCourse(pupil ? pupil.id : 0)}>{t('single.joinPupilModal.add')}</Button>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default JoinPupilModal;
