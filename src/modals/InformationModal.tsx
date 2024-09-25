import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { useTranslation } from 'react-i18next';

interface InformationModalProps extends BaseModalProps {
    headline: React.ReactNode;
    children: React.ReactNode;
    showCloseButton?: boolean;
}

const InformationModal = ({ headline, children, isOpen, onOpenChange, showCloseButton }: InformationModalProps) => {
    const { t } = useTranslation();
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{headline}</ModalTitle>
            </ModalHeader>
            <div>{children}</div>
            {showCloseButton && (
                <ModalFooter>
                    <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('back')}
                    </Button>
                </ModalFooter>
            )}
        </Modal>
    );
};

export default InformationModal;
