import { Button } from '@/components/Button';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { useTranslation } from 'react-i18next';
import { NextStepLabelType, getNextStepIcon } from '../../../helper/important-information-helper';

interface NextStepModalProps extends BaseModalProps {
    header?: string;
    title: string;
    description: string;
    buttons?: {
        label: string;
        btnfn: (() => void) | null;
    }[];
    label?: NextStepLabelType;
}

const NextStepModal = ({ header, title, description, buttons, isOpen, label, onOpenChange }: NextStepModalProps) => {
    const { t } = useTranslation();
    const NextStepIcon = label ? getNextStepIcon(label) : getNextStepIcon(NextStepLabelType.DEFAULT);

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col">
                <div className="flex flex-col items-center">
                    <div>
                        <NextStepIcon />
                    </div>
                    <Typography>{description}</Typography>
                </div>
                <ModalFooter>
                    <div className="flex-1 w-full flex flex-col gap-2 mt-4">
                        {buttons && (
                            <div className={cn('flex w-full flex-wrap gap-2', buttons.length > 1 ? 'flex-row' : 'flex-col')}>
                                {buttons?.map((btn, idx) => (
                                    <div className="flex-1">
                                        <Button
                                            variant={idx === 0 ? 'default' : 'outline'}
                                            onClick={() => {
                                                btn.btnfn && btn.btnfn();
                                            }}
                                            className="w-full"
                                        >
                                            {btn.label}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button className="w-full" onClick={() => onOpenChange(false)} variant="outline">
                            {t('cancel')}
                        </Button>
                    </div>
                </ModalFooter>
            </div>
        </Modal>
    );
};
export default NextStepModal;
