import React, { useState } from 'react';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { languageIcons } from '../I18n';
import { Button } from './Button';

const SwitchLanguageButton: React.FC = () => {
    const [showSwitchLanguage, setShowSwitchLanguage] = useState(false);

    const storageLanguage = localStorage.getItem('lernfair-language');

    const Icon = languageIcons[storageLanguage as keyof typeof languageIcons];

    return (
        <>
            <Button onClick={() => setShowSwitchLanguage(true)} variant="none" size="icon">
                <Icon />
            </Button>
            <SwitchLanguageModal isOpen={showSwitchLanguage} onCloseModal={() => setShowSwitchLanguage(false)} />
        </>
    );
};

export default SwitchLanguageButton;
