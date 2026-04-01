import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { TeachingExperienceLevelEnum, TeachingExperienceLevelSelector } from '@/components/TeachingExperienceLevelSelector';
import { Typography } from '@/components/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EditTeachingExperienceLevelModalProps extends BaseModalProps {
    teachingExperienceLevel: {
        '1:1'?: TeachingExperienceLevelEnum;
        group?: TeachingExperienceLevelEnum;
    };
    onSave: (teachingExperienceLevel?: { '1:1'?: TeachingExperienceLevelEnum; group?: TeachingExperienceLevelEnum }) => void;
}

export function EditTeachingExperienceLevelModal({ teachingExperienceLevel, onOpenChange, isOpen, onSave }: EditTeachingExperienceLevelModalProps) {
    const [selectedValue, setSelectedValue] = useState(teachingExperienceLevel);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        onSave(selectedValue);
        onOpenChange(false);
    };
    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Unterrichtserfahrungen</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-col items-center gap-y-3 md:max-w-[536px] w-full pb-8">
                    <div className="w-[400px]">
                        <div className="mb-8">
                            <Typography className="font-medium text-center mb-4">{t('registration.steps.teachingExperience.individual')}</Typography>
                            <div className="flex justify-center gap-x-2">
                                <TeachingExperienceLevelSelector
                                    toggleConfig={{ variant: 'primary' }}
                                    value={selectedValue['1:1']}
                                    setValue={(value) => setSelectedValue({ ...selectedValue, '1:1': value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Typography className="font-medium text-center mb-4">{t('registration.steps.teachingExperience.group')}</Typography>
                            <div className="flex justify-center gap-x-2">
                                <TeachingExperienceLevelSelector
                                    toggleConfig={{ variant: 'primary' }}
                                    value={selectedValue.group}
                                    setValue={(value) => setSelectedValue({ ...selectedValue, group: value })}
                                />
                            </div>
                        </div>
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
