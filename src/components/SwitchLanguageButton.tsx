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
            <Button
                className="group rounded-full hover:bg-primary-light hover:brightness-105"
                onClick={() => setShowSwitchLanguage(true)}
                variant="none"
                size="icon"
            >
                <Icon />
            </Button>
            <SwitchLanguageModal isOpen={showSwitchLanguage} onIsOpenChange={setShowSwitchLanguage} />
        </>
    );
};

export default SwitchLanguageButton;
