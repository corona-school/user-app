import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { cn } from '@/lib/Tailwind';

interface CourseConfirmationModalProps extends BaseModalProps {
    headline: string;
    confirmButtonText: string;
    description: ReactNode;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
}
const CourseConfirmationModal = ({
    headline,
    confirmButtonText,
    description,
    onConfirm,
    isOpen,
    onOpenChange,
    variant = 'default',
}: CourseConfirmationModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle className={variant === 'default' ? 'text-primary' : 'text-destructive'}>{headline}</ModalTitle>
            </ModalHeader>
            <div>
                <Typography className="mb-1">{description}</Typography>
            </div>
            <ModalFooter>
                <div className={cn('flex gap-4', variant === 'default' ? 'flex-row' : 'flex-row-reverse')}>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('cancel')}
                    </Button>
                    <Button variant={variant} onClick={onConfirm}>
                        {confirmButtonText}
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    );
};

export default CourseConfirmationModal;
