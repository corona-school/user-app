import { Modal, ModalHeader, ModalTitle } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
import { switchLanguage, languageListSelectionModal } from '../I18n';
import { IconLoader } from '@/components/IconLoader';

type Props = {
    isOpen: boolean;
    onIsOpenChange: (value: boolean) => void;
};

export const SwitchLanguageModal: React.FC<Props> = ({ isOpen, onIsOpenChange }) => {
    const storageLanguage = localStorage.getItem('lernfair-language');
    return (
        <Modal onOpenChange={onIsOpenChange} isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>Sprache wechseln / Choose language</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col py-4 gap-y-4">
                {languageListSelectionModal.map((button, i) => {
                    return (
                        <Toggle
                            pressed={storageLanguage === button.short}
                            variant="outline"
                            size="lg"
                            onPressedChange={() => {
                                switchLanguage(button.short);
                                onIsOpenChange(false);
                            }}
                            key={i}
                            className="justify-center pl-[5%]"
                        >
                            <IconLoader icon={button.short} className={`mr-2 rounded-full h-5 w-5 border`} />
                            <span className="min-w-[18%] text-left">{button.name}</span>
                        </Toggle>
                    );
                })}
            </div>
        </Modal>
    );
};
