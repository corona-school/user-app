import { Button } from '@/components/Button';
import { FormalEducationEnum, FormalEducationSelector } from '@/components/FormalEducationSelector';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EditFormalEducationModalProps extends BaseModalProps {
    formalEducation?: FormalEducationEnum | string;
    onSave: (formalEducation?: FormalEducationEnum | string) => void;
}

export function EditFormalEducationModal({ formalEducation, onOpenChange, isOpen, onSave }: EditFormalEducationModalProps) {
    const [selectedValue, setSelectedValue] = useState(formalEducation);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        onSave(selectedValue);
        onOpenChange(false);
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Arbeit mit Kindern/Jugendlichen</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col items-center gap-y-3 md:max-w-[536px] w-full pb-32 md:pb-0">
                    <div className="w-full md:pb-0">
                        <FormalEducationSelector
                            value={selectedValue?.startsWith(FormalEducationEnum.other) ? FormalEducationEnum.other : (selectedValue as FormalEducationEnum)}
                            setValue={(value) => setSelectedValue(value)}
                            className="flex flex-wrap justify-center"
                            toggleConfig={{ variant: 'primary' }}
                            freeTextConfig={{
                                placeholder: t('formalEducation.other'),
                                freeTextOption: FormalEducationEnum.other,
                                value: selectedValue?.startsWith(`${FormalEducationEnum.other}:`) ? selectedValue : '',
                                onChange: (value) => setSelectedValue(value),
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
