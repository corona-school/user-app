import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Screening_Jobstatus_Enum } from '@/gql/graphql';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JobStatusSelector } from './JobStatusSelector';

interface EditJobStatusModalProps extends BaseModalProps {
    jobStatus?: Screening_Jobstatus_Enum;
    onSave: (jobStatus?: Screening_Jobstatus_Enum) => void;
}

export function EditJobStatusModal({ jobStatus, onOpenChange, isOpen, onSave }: EditJobStatusModalProps) {
    const [selectedValue, setSelectedValue] = useState(jobStatus);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        onSave(selectedValue);
        onOpenChange(false);
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Beruflicher Status bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <JobStatusSelector className="grid grid-cols-5" value={selectedValue} setValue={setSelectedValue} />
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" onClick={handleOnSave}>
                    {t('select')}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
