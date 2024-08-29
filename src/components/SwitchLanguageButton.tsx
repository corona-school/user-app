import { Button } from 'native-base';
import React, { useState } from 'react';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { languageIcons } from '../I18n';

const SwitchLanguageButton: React.FC = () => {
    const [showSwitchLanguage, setShowSwitchLanguage] = useState(false);

    const storageLanguage = localStorage.getItem('lernfair-language');

    const Icon = languageIcons[storageLanguage as keyof typeof languageIcons];

    return (
        <>
            <Button onPress={() => setShowSwitchLanguage(true)} variant="ghost">
                <Icon />
            </Button>
            <SwitchLanguageModal isOpen={showSwitchLanguage} onCloseModal={() => setShowSwitchLanguage(false)} />
        </>
    );
};

export default SwitchLanguageButton;
