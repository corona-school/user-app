import { Language as LanguageEnum, Pupil_Languages_Enum, Student_Languages_Enum } from '@/gql/graphql';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Language = Pupil_Languages_Enum | Student_Languages_Enum;

interface EditLanguagesModalProps<T extends Language> extends BaseModalProps {
    languages: T[];
    onSave: (languages: T[]) => void;
}

export function EditLanguagesModal<T extends Language>({ languages, onOpenChange, isOpen, onSave }: EditLanguagesModalProps<T>) {
    const [selectedLanguages, setSelectedLanguages] = useState<T[]>(languages);
    const { t } = useTranslation();

    const handleOnSave = async () => {
        onSave(selectedLanguages);
        onOpenChange(false);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="overflow-y-visible" size="lg">
            <ModalHeader>
                <ModalTitle>Sprachen bearbeiten</ModalTitle>
            </ModalHeader>
            <div>
                <div className="flex justify-center">
                    <div className="flex flex-col gap-y-2 justify-center max-w-[576px]" id="screening-languages-modal-content">
                        <LanguageSelector
                            maxVisibleItems={8}
                            className="flex flex-wrap justify-center p-1"
                            searchConfig={{
                                containerClassName: 'w-full flex justify-center',
                                className: 'bg-white border border-solid border border-accent-dark max-w-[190px]',
                                placeholder: t('otherLanguages'),
                                portalContainerId: 'screening-languages-modal-content',
                            }}
                            toggleConfig={{
                                variant: 'outline-accent',
                                size: 'lg',
                                className: 'justify-center w-auto font-semibold h-[40px] [&_svg]:size-5 px-4',
                            }}
                            multiple
                            value={selectedLanguages as unknown as LanguageEnum[]}
                            setValue={(languages) => setSelectedLanguages(languages as unknown as T[])}
                        />
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
            </div>
        </Modal>
    );
}
