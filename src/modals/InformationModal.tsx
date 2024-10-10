import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { useTranslation } from 'react-i18next';

interface InformationModalProps extends BaseModalProps {
    headline: React.ReactNode;
    children: React.ReactNode;
    showCloseButton?: boolean;
    variant?: 'default' | 'destructive';
    className?: string;
}

const InformationModal = ({ headline, children, isOpen, onOpenChange, showCloseButton, className, variant = 'default' }: InformationModalProps) => {
    const { t } = useTranslation();
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className={className}>
            <ModalHeader>
                <ModalTitle className={variant === 'default' ? 'text-primary' : 'text-destructive'}>{headline}</ModalTitle>
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
