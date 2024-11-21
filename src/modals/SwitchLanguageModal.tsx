import { Modal, ModalHeader, ModalTitle } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
import { switchLanguage, languageList, languageIcons } from '../I18n';

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
                {languageList.map((button, i) => {
                    const Icon = languageIcons[button.short as keyof typeof languageIcons];

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
                            <Icon className={`mr-2 rounded-full h-5 w-5 border`} />
                            <span className="min-w-[18%] text-left">{button.name}</span>
                        </Toggle>
                    );
                })}
            </div>
        </Modal>
    );
};
