import { Box, Button, Modal, Text, useTheme, VStack } from 'native-base';

export function ConfirmModal({ text, isOpen, onConfirmed, onClose }: { text: string; isOpen: boolean; onConfirmed: () => void; onClose: () => void }) {
    const { space } = useTheme();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Box bgColor="white" borderRadius="15px" padding={space['2']}>
                <VStack space={space['1']}>
                    <Text>{text}</Text>
                    <Button onPress={onConfirmed} variant="solid">
                        Ja
                    </Button>
                    <Button onPress={onClose} variant="outline">
                        Nein
                    </Button>
                </VStack>
            </Box>
        </Modal>
    );
}
