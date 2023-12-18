import { Text, Modal, Button, Stack, HStack, VStack, Box } from 'native-base';
import { useTranslation } from 'react-i18next';
import IconBook from '../../../assets/icons/icon_buch.svg';

type Props = {
    header: string;
    title: string;
    description: string;
    buttons?: {
        label: string;
        btnfn: (() => void) | null;
    }[];
    isOpen?: boolean;
    onClose: () => any;
};

const NextStepModal: React.FC<Props> = ({ header, title, description, buttons, isOpen, onClose }) => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content width="530px" maxWidth="unset" padding={6}>
                <Modal.CloseButton />
                <VStack space={6}>
                    <HStack space={6} paddingX={6} paddingTop={6}>
                        <IconBook />
                        <VStack>
                            <Text fontSize="14px">{header}</Text>
                            <Text fontSize="36px" bold>
                                {title}
                            </Text>
                        </VStack>
                    </HStack>
                    <Box>
                        <Text>{description}</Text>
                    </Box>
                    <Box>
                        <Stack space={4} width="100%" direction={buttons?.length && buttons.length > 1 ? 'row' : 'column'} flexWrap="wrap">
                            {buttons?.map((btn, idx) => (
                                <Button
                                    variant={idx === 0 ? 'solid' : 'outline'}
                                    onPress={() => {
                                        btn.btnfn && btn.btnfn();
                                    }}
                                    width={buttons.length > 1 ? '232px' : '100%'}
                                    marginBottom="16px"
                                >
                                    {btn.label}
                                </Button>
                            ))}
                        </Stack>
                        <Button onPress={onClose} width="100%" variant="outline">
                            {t('cancel')}
                        </Button>
                    </Box>
                </VStack>
            </Modal.Content>
        </Modal>
    );
};
export default NextStepModal;
