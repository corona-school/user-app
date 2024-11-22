import { Pupil_Languages_Enum, Student_Languages_Enum } from '../../gql/graphql';
import { LanguageTagList, allLanguages } from '../../components/LanguageTag';
import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
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
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-max">
            <ModalHeader>
                <ModalTitle>Sprachen bearbeiten</ModalTitle>
            </ModalHeader>
            <div>
                <Typography className="font-bold">Verfügbare Sprachen:</Typography>
                <div className="max-w-[800px]">
                    <LanguageTagList
                        languages={allLanguages.filter((it) => !selectedLanguages.includes(it as T))}
                        onPress={(it) => setSelectedLanguages((prev) => [...prev, it as T])}
                    />

                    <Typography className="font-bold">Ausgewählte Sprachen:</Typography>
                    <LanguageTagList languages={selectedLanguages} onPress={(it) => setSelectedLanguages((prev) => prev.filter((k) => k !== it))} />
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
