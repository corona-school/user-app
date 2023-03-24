import { Button, Modal, Stack, TextArea, useToast, VStack } from 'native-base';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import WhatsappIcon from '../assets/icons/icon_whatsapp.svg';
import CopyToClipboardIcon from '../assets/icons/icon_copy_to_clipboard.svg';
import SignalIcon from '../assets/icons/icon_signal.svg';
import EmailIcon from '../assets/icons/icon_email.svg';
import useInterval from '../hooks/useInterval';

type ModalProps = {
    showRecommendModal: boolean;
    onClose: () => void;
};
const RecommendModal: React.FC<ModalProps> = ({ showRecommendModal, onClose }) => {
    const toast = useToast();
    const { t } = useTranslation();
    const [copied, setCopied] = useState<boolean>();

    const recommendTextEncoded =
        'Hey%2C+%0D%0A%0D%0Aich+engagiere+mich+ehrenamtlich+bei+Lern-Fair+e.V.+f%C3%BCr+mehr+Bildungschancen+und+Gerechtigkeit+in+Deutschland.+Vielleicht+w%C3%A4re+das+ja+auch+etwas+f%C3%BCr+dich%3F+Es+ist+total+einfach+und+komplett+flexibel%2C+da+alles+online+stattfindet+und+du+von+zuhause+aus+mitmachen+kannst.+%0D%0A%0D%0AIch+w%C3%BCrde+mich+freuen%2C+wenn+du+dabei+w%C3%A4rst%21+%0D%0AAlle+Infos+findest+du+auf+der+Website%3A+www.lern-fair.de';

    const recommendText =
        'Hey, ich engagiere mich ehrenamtlich bei Lern-Fair e.V. für mehr Bildungschancen und Gerechtigkeit in Deutschland. Vielleicht wäre das ja auch etwas für dich? Es ist total einfach und komplett flexibel, da alles online stattfindet und du von zuhause aus mitmachen kannst. Ich würde mich freuen, wenn du dabei wärst! Alle Infos findest du auf der Website: www.lern-fair.de';

    const copyTextToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleCopyClick = () => {
        copyTextToClipboard(recommendText);
        setCopied(true);
        toast.show({
            description: 'Text in die Zwischenablage kopiert.',
            placement: 'top',
        });
    };

    useInterval(() => {
        setCopied(false);
    }, 10_000);

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
                        <TextArea h="180" value={recommendText} isReadOnly autoCompleteType="" />
                        <Button onPress={() => handleCopyClick()}>
                            <Stack space="2" direction={'row'} alignItems="center">
                                <CopyToClipboardIcon />
                                {copied ? 'Text kopiert!' : 'Text kopieren'}
                            </Stack>
                        </Button>
                        <Button variant="outline" onPress={() => window.open(`https://wa.me/?text=${recommendTextEncoded}`, '_blank')}>
                            <Stack space="2" direction={'row'} alignItems="center">
                                <WhatsappIcon />
                                {t('dashboard.helpers.channels.whatsApp')}
                            </Stack>
                        </Button>
                        <Button variant="outline" onPress={() => window.open(`https://signal.me/?text=${recommendTextEncoded}`, '_blank')}>
                            <Stack space="2" direction={'row'} alignItems="center">
                                <SignalIcon />
                                {t('dashboard.helpers.channels.signal')}
                            </Stack>
                        </Button>
                        <Button
                            onPress={() => (window.location.href = `mailto:?subject=Engagiere+dich+bei+Lern-Fair%21&body=${recommendTextEncoded}`)}
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
