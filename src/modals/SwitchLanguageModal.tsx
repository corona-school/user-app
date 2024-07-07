import { VStack, useTheme, Button, Modal } from 'native-base';
import { switchLanguage, languageList, languageComponents } from '../I18n';
import { getLanguageSelection } from '../helper/getLanguageSelection';

type Props = {
    isOpen: boolean;
    onCloseModal: () => any;
};

export const SwitchLanguageModal: React.FC<Props> = ({ isOpen, onCloseModal }) => {
    const { space } = useTheme();

    const lang = getLanguageSelection();

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <Modal.Content>
                <VStack>
                    <Modal.CloseButton />
                    <Modal.Header>Sprache wechseln / Choose language</Modal.Header>
                </VStack>
                <VStack padding={space['1']} space={space['1']}>
                    {languageList.map((button, i) => {
                        const Icon = languageComponents[button.short as keyof typeof languageComponents];

                        return (
                            <Button
                                isPressed={lang === button.short}
                                variant={'outlinemiddle'}
                                leftIcon={<Icon />}
                                _stack={{ justifyContent: 'left', width: '35%' }}
                                onPress={() => {
                                    switchLanguage(button.short);
                                    onCloseModal();
                                }}
                                key={i}
                            >
                                {button.name}
                            </Button>
                        );
                    })}
                </VStack>
            </Modal.Content>
        </Modal>
    );
};
