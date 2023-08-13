import { Box, Button, Modal, Text, useTheme, VStack } from 'native-base';
import { useTranslation } from 'react-i18next';
import { IconLoader } from '../components/IconLoader';

export function ConfirmModal({
    text,
    isOpen,
    onConfirmed,
    onClose,
    danger,
}: {
    text: string;
    isOpen: boolean;
    onConfirmed: () => void;
    onClose: () => void;
    danger?: boolean;
}) {
    const { t } = useTranslation();
    const { space } = useTheme();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Box bgColor="white" borderRadius="15px" padding={space['2']}>
                <VStack space={space['1']} alignItems="center">
                    {danger && <IconLoader iconPath="lf_caution.svg" />}
                    <Text>{text}</Text>
                    <Button onPress={onConfirmed} variant={danger ? 'outline' : 'solid'} width="90%">
                        {t('yes')}
                    </Button>
                    <Button onPress={onClose} variant={danger ? 'solid' : 'outline'} width="90%">
                        {t('no')}
                    </Button>
                </VStack>
            </Box>
        </Modal>
    );
}
