import { Pupil_Languages_Enum, Student_Languages_Enum } from '../../gql/graphql';
import { LanguageTagList, allLanguages } from '../../components/LanguageTag';

import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { gql } from '@/gql';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type Language = Pupil_Languages_Enum | Student_Languages_Enum;

interface EditLanguagesModalProps<T extends Language> extends BaseModalProps {
    pupilOrStudentId: number;
    languages: T[];
    onLanguagesUpdated: () => Promise<void>;
    type: 'pupil' | 'student';
}

const UPDATE_PUPIL_LANGUAGES_MUTATION = gql(`
    mutation PupilUpdateLanguages($pupilId: Float!, $languages: [Language!]) { pupilUpdate(pupilId: $pupilId, data: { languages: $languages }) }
`);

const UPDATE_STUDENT_LANGUAGES_MUTATION = gql(`
    mutation StudentUpdateLanguages($studentId: Float!, $languages: [StudentLanguage!]) { studentUpdate(studentId: $studentId, data: { languages: $languages }) }
`);

export function EditLanguagesModal<T extends Language>({
    languages,
    pupilOrStudentId,
    type,
    onLanguagesUpdated,
    onOpenChange,
    isOpen,
}: EditLanguagesModalProps<T>) {
    const [selectedLanguages, setSelectedLanguages] = useState<T[]>(languages);
    const [mutationUpdatePupilLanguages, { loading: isLoadingPupil }] = useMutation(UPDATE_PUPIL_LANGUAGES_MUTATION);
    const [mutationUpdateStudentLanguages, { loading: isLoadingStudent }] = useMutation(UPDATE_STUDENT_LANGUAGES_MUTATION);
    const { t } = useTranslation();

    const onSave = async () => {
        try {
            if (type === 'pupil') {
                await mutationUpdatePupilLanguages({
                    variables: {
                        pupilId: pupilOrStudentId,
                        languages: selectedLanguages as any[],
                    },
                });
            } else {
                await mutationUpdateStudentLanguages({
                    variables: {
                        studentId: pupilOrStudentId,
                        languages: selectedLanguages as any[],
                    },
                });
            }
            toast.success(t('changesWereSaved'));
        } catch (error) {
            toast.error(t('error'));
        } finally {
            onOpenChange(false);
        }
        onLanguagesUpdated();
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
                    <Button className="w-full lg:w-fit" isLoading={isLoadingPupil || isLoadingStudent} onClick={onSave}>
                        {t('select')}
                    </Button>
                </ModalFooter>
            </div>
        </Modal>
    );
}
