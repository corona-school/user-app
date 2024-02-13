import { Text, Modal, Button, Stack, VStack, Box, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { NextStepLabelType, getNextStepIcon } from '../../../helper/important-information-helper';

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
};

const NextStepModal: React.FC<Props> = ({ header, title, description, buttons, isOpen, label, onClose }) => {
    const { t } = useTranslation();
    const NextStepIcon = label ? getNextStepIcon(label) : getNextStepIcon(NextStepLabelType.DEFAULT);

    const modalHeight = useBreakpointValue({ base: '100vh', md: 'auto' });
    const modalWidth = useBreakpointValue({ base: '100vw', md: '530px' });
    const modalBorderRadius = useBreakpointValue({ base: '0', md: '8px' });

    const iconTextDir = useBreakpointValue({ base: 'column', md: 'row' });
    const iconTextAllign = useBreakpointValue({ base: 'center', md: 'flex-start' });
    const iconScale = useBreakpointValue({ base: 2, md: 1 });
    const iconPadding = useBreakpointValue({ base: '32px', md: '0' });

    const justifyContent = useBreakpointValue({ base: 'space-between', md: 'flex-start' });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content height={modalHeight} maxHeight="unset" width={modalWidth} maxWidth="unset" padding={6} marginY={0} borderRadius={modalBorderRadius}>
                <Modal.CloseButton />
                <VStack height="100%" space={6} justifyContent={justifyContent}>
                    <VStack space={6}>
                        <Stack space={6} paddingX={6} paddingTop={6} direction={iconTextDir} alignItems={iconTextAllign}>
                            <Box style={{ transform: [{ scale: iconScale }] }} paddingY={iconPadding}>
                                <NextStepIcon />
                            </Box>
                            <VStack alignItems={iconTextAllign}>
                                <Text fontSize="14px">{header}</Text>
                                <Text fontSize="36px" bold>
                                    {title}
                                </Text>
                            </VStack>
                        </Stack>
                        <Box>
                            <Text>{description}</Text>
                        </Box>
                    </VStack>
                    <Box>
                        {buttons && (
                            <Stack space={4} width="100%" direction={buttons.length > 1 ? 'row' : 'column'} flexWrap="wrap">
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
                        )}
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
