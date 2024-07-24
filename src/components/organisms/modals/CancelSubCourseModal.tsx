import { useMutation } from '@apollo/client';
import { Button } from '@/components/atoms/Button';
import { ModalFooter, ModalHeader, ModalTitle, Modal, type ModalProps } from '@/components/atoms/Modal';
import { Typography } from '@/components/atoms/Typography';
import { gql } from '@/gql';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface CancelSubCourseModalProps extends Pick<ModalProps, 'isOpen' | 'onOpenChange'> {
    subcourseId: number;
    onCourseCancel?: () => void;
}

const CANCEL_SUBCOURSE_MUTATION = gql(`mutation CancelSubcourse($subcourseId: Float!) {
    subcourseCancel(subcourseId: $subcourseId)
  }`);

const CancelSubCourseModal = ({ isOpen, onOpenChange, subcourseId, onCourseCancel }: CancelSubCourseModalProps) => {
    const { t } = useTranslation();
    const [cancelSubcourse, { loading: isCanceling }] = useMutation(CANCEL_SUBCOURSE_MUTATION, { variables: { subcourseId } });

    const handleOnCourseCancel = async () => {
        try {
            await cancelSubcourse();
            toast.success(t('course.cancelation_success'));
            if (onCourseCancel) onCourseCancel();
        } catch (error) {
            toast.error(t('course.cancelation_error'));
        } finally {
            onOpenChange(false);
        }
    };

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>{t('course.cancel.header')}</ModalTitle>
            </ModalHeader>
            <Typography className="py-4">{t('course.cancel.description')}</Typography>
            <ModalFooter>
                <div className="flex flex-row gap-4">
                    <Button variant="destructive" onClick={handleOnCourseCancel} isLoading={isCanceling}>
                        {t('course.cancel.header')}
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {t('cancel')}
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    );
};
export default CancelSubCourseModal;
