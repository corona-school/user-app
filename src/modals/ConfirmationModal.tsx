import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

interface ConfirmationModalProps extends BaseModalProps {
    headline: string;
    confirmButtonText: string;
    description: ReactNode;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
    isLoading?: boolean;
}
const ConfirmationModal = ({
    headline,
    confirmButtonText,
    description,
    onConfirm,
    isOpen,
    onOpenChange,
    variant = 'default',
    isLoading,
}: ConfirmationModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle className={variant === 'default' ? 'text-primary' : 'text-destructive'}>{headline}</ModalTitle>
            </ModalHeader>
            <div>
                <Typography className="mb-1">{description}</Typography>
            </div>
            <ModalFooter variant={variant}>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" variant={variant} onClick={onConfirm} isLoading={isLoading}>
                    {confirmButtonText}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ConfirmationModal;
