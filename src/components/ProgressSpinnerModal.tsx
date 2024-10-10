import CenterLoadingSpinner from './CenterLoadingSpinner';
import { BaseModalProps, Modal, ModalHeader, ModalTitle } from './Modal';
import { Typography } from './Typography';

interface ProgressSpinnerModalProps extends BaseModalProps {
    title: string;
    description: string;
}

// Shows an overlay spinner to block the page while something is loading
export function ProgressSpinnerModal({ isOpen, onOpenChange, title, description }: ProgressSpinnerModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-3 items-center justify-center">
                <Typography>{description}</Typography>
                <CenterLoadingSpinner />
            </div>
        </Modal>
    );
}
