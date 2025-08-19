import { useTranslation } from 'react-i18next';
import WarningIcon from '../assets/icons/lernfair/lf_caution.svg';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

export enum RejectType {
    CANCEL = 'cancel',
    DECLINE = 'decline',
}

type ModalProps = {
    isOpen: boolean;
    onDelete: () => void;
    onOpenChange: (isOpen: boolean) => void;
    rejectType: RejectType;
};

const RejectAppointmentModal: React.FC<ModalProps> = ({ isOpen, onOpenChange, onDelete, rejectType }) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalHeader>
                <ModalTitle>{rejectType === RejectType.CANCEL ? t('appointment.deleteModal.heading') : t('appointment.declineModal.heading')}</ModalTitle>
            </ModalHeader>
            <div className="flex w-full gap-2">
                <WarningIcon className="shrink-0" />
                <div className="flex flex-col gap-2">
                    <Typography>{rejectType === RejectType.CANCEL ? t('appointment.deleteModal.title') : t('appointment.declineModal.title')}</Typography>
                    <Typography>
                        {rejectType === RejectType.CANCEL ? t('appointment.deleteModal.description') : t('appointment.declineModal.description')}
                    </Typography>
                </div>
            </div>

            <ModalFooter className="flex w-full justify-between">
                <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
                    {t('appointment.deleteModal.cancel')}
                </Button>
                <Button onClick={onDelete} variant={'destructive'} className="w-full">
                    {rejectType === RejectType.CANCEL ? t('appointment.deleteModal.delete') : t('appointment.declineModal.decline')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default RejectAppointmentModal;
