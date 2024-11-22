import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { SchoolTypeSelector } from '@/components/SchoolTypeSelector';
import { gql } from '@/gql';
import { Pupil_Schooltype_Enum } from '@/gql/graphql';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface EditSchoolTypeModalProps extends BaseModalProps {
    pupilId: number;
    schoolType: Pupil_Schooltype_Enum;
    onSchoolTypeUpdated: () => Promise<void>;
}

const UPDATE_SCHOOL_TYPE_MUTATION = gql(`
    mutation PupilUpdateSchoolType($pupilId: Float!, $schoolType: SchoolType!) { pupilUpdate(pupilId: $pupilId, data: { schooltype: $schoolType }) }
`);

export function EditSchoolTypeModal({ schoolType, onOpenChange, isOpen, pupilId, onSchoolTypeUpdated }: EditSchoolTypeModalProps) {
    const [selectedValue, setSelectedValue] = useState(schoolType);
    const [mutationUpdateSchoolType, { loading: isUpdatingPupil }] = useMutation(UPDATE_SCHOOL_TYPE_MUTATION);
    const { t } = useTranslation();

    const onSave = async () => {
        try {
            await mutationUpdateSchoolType({
                variables: {
                    pupilId: pupilId,
                    schoolType: selectedValue as any,
                },
            });

            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.error(t('error'));
        } finally {
            onOpenChange(false);
        }
        onSchoolTypeUpdated();
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Schulform bearbeiten</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <SchoolTypeSelector className="grid grid-cols-4" value={selectedValue as any} setValue={setSelectedValue as any} />
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" isLoading={isUpdatingPupil} onClick={onSave}>
                    {t('select')}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
