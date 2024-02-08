import { Button, Modal, Text, Stack, useTheme, Heading, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Lecture_Appointmenttype_Enum } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';

type ZoomMeetingModalProps = {
    appointmentId: number;
    appointmentType: Lecture_Appointmenttype_Enum;
    zoomUrl: string | undefined;
};

const ZoomMeetingModal: React.FC<ZoomMeetingModalProps> = ({ appointmentId, appointmentType, zoomUrl }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Body>
                    <VStack marginBottom={space['1.5']} alignItems="left">
                        <Heading fontSize="md">{t('appointment.zoomModal.header')}</Heading>
                        <Text mt={5}>{t('appointment.zoomModal.description')}</Text>
                    </VStack>

                    <Stack space={space['0.5']} direction="column" width="full" justifyContent="center">
                        <Button onPress={() => navigate(`/video-chat/${appointmentId}/${appointmentType}`)}>{t('appointment.zoomModal.browser')}</Button>
                        <Button isDisabled={!zoomUrl} onPress={() => window.open(zoomUrl, '_self')}>
                            {t('appointment.zoomModal.zoomClient')}
                        </Button>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default ZoomMeetingModal;
