import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { BaseModalProps, Modal, ModalHeader, ModalTitle } from '@/components/Modal';
import { TextArea } from '@/components/TextArea';
import { Button } from '@/components/Button';
import { IconCopy, IconBrandWhatsapp, IconAt } from '@tabler/icons-react';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

interface RecommendModalProps extends BaseModalProps {}

const RecommendModal = ({ isOpen, onOpenChange }: RecommendModalProps) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState<boolean>();
    const { trackEvent } = useMatomo();

    const copyTextToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleCopyClick = () => {
        copyTextToClipboard(t('dashboard.helpers.contents.recommendText'));
        setCopied(true);
        toast.info(t('dashboard.helpers.contents.toast'));
        trackEvent({
            category: 'Recommend Section on Start Page',
            action: 'Click Button “Copy Text” in Recommend Modal',
            name: 'huh',
        });
    };

    const handleOnShareWithWhatsAppClick = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(t('dashboard.helpers.contents.recommendText'))}`, '_blank');
        trackEvent({
            category: 'Recommend Section on Start Page',
            action: 'Click Button “WhatsApp” in Recommend Modal',
            name: 'huh',
        });
    };

    const handleOnShareWithEmail = () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(t('dashboard.helpers.contents.recommendSubject'))}&body=${encodeURIComponent(
            t('dashboard.helpers.contents.recommendText')
        )}`;
        trackEvent({
            category: 'Recommend Section on Start Page',
            action: 'Click Button “e-mail” in Recommend Modal',
            name: 'huh',
        });
    };

    useEffect(() => {
        let id: NodeJS.Timer;
        if (copied) {
            id = setInterval(() => {
                setCopied(false);
            }, 10_000);
        }
        return () => clearInterval(id);
    }, [copied]);

    useEffect(() => {
        if (!isOpen) {
            setCopied(false);
        }
    }, [isOpen]);

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('dashboard.helpers.headlines.recommend')}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col">
                <TextArea className="h-44 mb-2" value={t('dashboard.helpers.contents.recommendText')} readOnly />
                <div className="flex flex-col gap-y-2">
                    <Button className="w-full" onClick={handleCopyClick} leftIcon={<IconCopy />}>
                        {copied ? t('copied_text') : t('copy_text')}
                    </Button>
                    <Button className="w-full" variant="outline" onClick={handleOnShareWithWhatsAppClick} leftIcon={<IconBrandWhatsapp />}>
                        {t('dashboard.helpers.channels.whatsApp')}
                    </Button>
                    <Button className="w-full" onClick={handleOnShareWithEmail} variant="outline" leftIcon={<IconAt />}>
                        {t('dashboard.helpers.channels.email')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RecommendModal;
