import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { SpecialTeachingExperienceEnum, SpecialTeachingExperienceSelector } from '@/components/SpecialTeachingExperienceSelector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EditSpecialTeachingExperienceProps extends BaseModalProps {
    specialTeachingExperience: {
        selectValues: SpecialTeachingExperienceEnum[];
        freeTextValue?: string;
    };
    onSave: (specialTeachingExperience?: { selectValues: SpecialTeachingExperienceEnum[]; freeTextValue?: string }) => void;
}

export function EditSpecialTeachingExperience({ specialTeachingExperience, onOpenChange, isOpen, onSave }: EditSpecialTeachingExperienceProps) {
    const [selectedValues, setSelectedValues] = useState(specialTeachingExperience.selectValues);
    const [freeTextValue, setFreeTextValue] = useState(specialTeachingExperience.freeTextValue);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        onSave({ selectValues: selectedValues, freeTextValue });
        onOpenChange(false);
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Besondere Kenntnisse</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col items-center gap-y-3 md:max-w-[536px] w-full pb-32 md:pb-0">
                    <div className="w-full md:pb-0">
                        <SpecialTeachingExperienceSelector
                            multiple
                            value={selectedValues}
                            setValue={setSelectedValues}
                            className="flex flex-wrap justify-center"
                            toggleConfig={{ variant: 'primary' }}
                            freeTextConfig={{
                                placeholder: t('specialTeachingExperience.other'),
                                freeTextOption: SpecialTeachingExperienceEnum.other,
                                value: freeTextValue,
                                onChange: setFreeTextValue,
                                className: 'border border-gray-300 focus:border-primary-light bg-transparent',
                            }}
                        />
                    </div>
                </div>
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
