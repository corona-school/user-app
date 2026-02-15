import { useTranslation } from 'react-i18next';
import { Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';

import { IconFileCheck } from '@tabler/icons-react';

type ModalProps = {
    isOpen: boolean;
    courseName: string | undefined;
    onOpenChange: (open: boolean, restore: boolean) => void;
};

const RestoreCourseDraftModal: React.FC<ModalProps> = ({ isOpen, onOpenChange, courseName }) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => onOpenChange(open, false)}>
            <ModalHeader>
                <ModalTitle>{t('course.CourseDate.restoreModal.title')}</ModalTitle>
            </ModalHeader>
            <div className="flex w-full gap-2">
                <IconFileCheck className="h-full size-12" />
                <div className="flex flex-col gap-2">
                    <Typography>{t('course.CourseDate.restoreModal.description', { courseName })}</Typography>
                </div>
            </div>

            <ModalFooter className="flex w-full justify-between">
                <Button onClick={() => onOpenChange(false, false)} variant="outline" className="w-full">
                    {t('course.CourseDate.restoreModal.discard')}
                </Button>
                <Button onClick={() => onOpenChange(false, true)} variant={'default'} className="w-full">
                    {t('course.CourseDate.restoreModal.restore')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default RestoreCourseDraftModal;
