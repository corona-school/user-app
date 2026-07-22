import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { TextArea } from '@/components/TextArea';
import { TooltipButton } from '@/components/Tooltip';
import { IconNote } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface ScreeningNotesModalProps extends BaseModalProps {
    studentId: number;
    notes?: string;
    onNotesSaved?: () => void;
}

export const ScreeningNotesModal = ({ onOpenChange, isOpen, studentId, notes: initialNotes, onNotesSaved }: ScreeningNotesModalProps) => {
    const { t } = useTranslation();
    const [notes, setNotes] = useState(initialNotes);

    const handleOnSaveNotes = async () => {
        if (!studentId) return;

        toast.success('Notizen werden gespeichert');
        onOpenChange(false);
        if (onNotesSaved) onNotesSaved();
    };

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} className="w-full max-w-fit">
            <ModalHeader>
                <ModalTitle>Interne Notizen</ModalTitle>
            </ModalHeader>
            <div>
                <div className="flex flex-col gap-y-1">
                    <Label htmlFor="descriptionForScreening">Gespeicherte Notiz</Label>
                    <TextArea className="resize-y h-40 w-full min-w-[600px]" id="descriptionForScreening" value={notes} onChangeText={setNotes} />
                </div>
            </div>
            <ModalFooter>
                <Button className="w-full lg:w-fit" variant="outline" onClick={() => onOpenChange(false)}>
                    {t('cancel')}
                </Button>
                <Button className="w-full lg:w-fit" onClick={handleOnSaveNotes} disabled={!notes || !studentId}>
                    Speichern
                </Button>
            </ModalFooter>
        </Modal>
    );
};

interface ScreeningNotesButtonProps {
    studentId: number;
    notes?: string;
}

export const ScreeningNotesButton = ({ studentId, notes }: ScreeningNotesButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <TooltipButton tooltipContent={notes ?? 'Keine Notiz vorhanden'}>
                <div
                    onClick={() => {
                        setIsModalOpen(true);
                    }}
                >
                    <IconNote />
                </div>
            </TooltipButton>
            <ScreeningNotesModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} studentId={studentId} notes={notes} />
        </>
    );
};
