import { Box, CloseIcon, Heading, Modal, Pressable, Text, Row, Button, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { getIconForNotificationPreferenceModal, getNotificationCategoriesData } from '../../../helper/notification-helper';

type Props = {
    onPressClose?: () => any;
    category: string;
};

const InformationModal: React.FC<Props> = ({ onPressClose, category }) => {
    const { t } = useTranslation();
    const { space } = useTheme();

    const data = getNotificationCategoriesData(category);
    const modaldata = data.allPrefs[category];
    const Icon = getIconForNotificationPreferenceModal(category);

    return (
        <>
            <Modal.Content width="307px" marginX="auto" backgroundColor="transparent">
                <Box position="absolute" zIndex="1" right="20px" top="14px">
                    <Pressable onPress={onPressClose}>
                        <CloseIcon color="white" />
                    </Pressable>
                </Box>
                <Modal.Body background="primary.900" padding={space['1']}>
                    <Box alignItems="center" marginY={space['1']}>
                        <Icon />
                    </Box>
                    <Box paddingY={space['1']}>
                        <Heading maxWidth="330px" marginX="auto" fontSize="md" textAlign="center" color="lightText" marginBottom={space['0.5']}>
                            {t(modaldata.title)}
                        </Heading>
                        <Text textAlign="center" color="lightText" maxWidth="330px" marginX="auto">
                            {t(modaldata.modal.body)}
                        </Text>
                    </Box>
                    <Box paddingY={space['1']}>
                        <Row marginBottom={space['0.5']}>
                            <Button onPress={onPressClose} width="100%">
                                {t('notification.controlPanel.closeButton')}
                            </Button>
                        </Row>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </>
    );
};

export default InformationModal;
