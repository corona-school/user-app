import { Text, Modal, Button, Stack, HStack, VStack, Box } from 'native-base';
import { useTranslation } from 'react-i18next';
import { NextStepLabelType, getNextStepIcon } from '../../../helper/important-information-helper';
import { CertificateToConfirm, ConfirmCertificate } from '../../../widgets/certificates/ConfirmCertificate';

type Props = {
    header: string;
    title: string;
    description: string;
    buttons?: {
        label: string;
        btnfn: (() => void) | null;
    }[];
    isOpen?: boolean;
    label?: NextStepLabelType;
    onClose: () => any;
    content?: CertificateToConfirm;
};

const NextStepModal: React.FC<Props> = ({ header, title, description, buttons, isOpen, label, onClose, content }) => {
    const { t } = useTranslation();
    const NextStepIcon = label ? getNextStepIcon(label) : getNextStepIcon(NextStepLabelType.DEFAULT);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content width="530px" maxWidth="unset" padding={6}>
                <Modal.CloseButton />
                <VStack space={6}>
                    <HStack space={6} paddingX={6} paddingTop={6}>
                        <NextStepIcon />
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
                    {content && (
                        <Box maxH="400px">
                            <ConfirmCertificate certificate={content} />
                        </Box>
                    )}
                    <Box>
                        <Stack space={4} width="100%" direction={buttons && buttons.length > 1 ? 'row' : 'column'} flexWrap="wrap">
                            {buttons?.map((btn, idx) => (
                                <Button
                                    variant={idx === 0 ? 'solid' : 'outline'}
                                    onPress={() => {
                                        btn.btnfn && btn.btnfn();
                                    }}
                                    width={idx + 1 === buttons.length && (idx + 1) % 2 !== 0 ? '100%' : '232px'}
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
