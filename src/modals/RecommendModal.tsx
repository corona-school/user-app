import { Button, Modal, Stack, TextArea, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import WhatsappIcon from '../assets/icons/icon_whatsapp.svg';
import CopyToClipboardIcon from '../assets/icons/icon_copy_to_clipboard.svg';
import SignalIcon from '../assets/icons/icon_signal.svg';
import EmailIcon from '../assets/icons/icon_email.svg';

type ModalProps = {
    showRecommendModal: boolean;
    onClose: () => void;
};
const RecommendModal: React.FC<ModalProps> = ({ showRecommendModal, onClose }) => {
    const toast = useToast();
    const { t } = useTranslation();
    const [copied, setCopied] = useState<boolean>();

    const copyTextToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleCopyClick = () => {
        copyTextToClipboard(t('dashboard.helpers.contents.recommendText'));
        setCopied(true);
        toast.show({
            description: 'Text in die Zwischenablage kopiert.',
            placement: 'top',
        });
    };

    useEffect(() => {
        setInterval(() => {
            setCopied(false);
        }, 10_000);
    }, [copied]);

    return (
        <Modal
            isOpen={showRecommendModal}
            onClose={() => {
                onClose();
                setCopied(false);
            }}
        >
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>{t('dashboard.helpers.headlines.recommend')}</Modal.Header>
                <Modal.Body>
                    <VStack space="3">
                        <TextArea h="180" value={t('dashboard.helpers.contents.recommendText')} isReadOnly autoCompleteType="" />
                        <Button onPress={() => handleCopyClick()}>
                            <Stack space="2" direction={'row'} alignItems="center">
                                <CopyToClipboardIcon />
                                {copied ? 'Text kopiert!' : 'Text kopieren'}
                            </Stack>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() => window.open(`https://wa.me/?text=${encodeURIComponent(t('dashboard.helpers.contents.recommendText'))}`, '_blank')}
                        >
                            <Stack space="2" direction={'row'} alignItems="center">
                                <WhatsappIcon />
                                {t('dashboard.helpers.channels.whatsApp')}
                            </Stack>
                        </Button>
                        <Button
                            variant="outline"
                            onPress={() =>
                                window.open(`https://signal.me/?text=${encodeURIComponent(t('dashboard.helpers.contents.recommendText'))}`, '_blank')
                            }
                        >
                            <Stack space="2" direction={'row'} alignItems="center">
                                <SignalIcon />
                                {t('dashboard.helpers.channels.signal')}
                            </Stack>
                        </Button>
                        <Button
                            onPress={() =>
                                (window.location.href = `mailto:?subject=Engagiere+dich+bei+Lern-Fair%21&body=${encodeURIComponent(
                                    t('dashboard.helpers.contents.recommendText')
                                )}`)
                            }
                            variant="outline"
                            textAlign="center"
                        >
                            <Stack space="2" direction={'row'} alignItems="center">
                                <EmailIcon />
                                {t('dashboard.helpers.channels.email')}
                            </Stack>
                        </Button>
                    </VStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};

export default RecommendModal;
