import { Button } from 'native-base';
import React, { useState } from 'react';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { languageComponents } from '../I18n';
import { getLanguageSelection } from '../helper/getLanguageSelection';

const SwitchLanguageButton: React.FC = () => {
    const [showSwitchLanguage, setShowSwitchLanguage] = useState(false);

    const lang = getLanguageSelection();

    const Icon = languageComponents[lang as keyof typeof languageComponents];

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
