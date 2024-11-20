import { useState } from 'react';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { languageIcons } from '../I18n';
import { Button } from './Button';
import { cn } from '@/lib/Tailwind';
//import '/node_modules/flag-icons/css/flag-icons.min.css';
import { DE } from 'country-flag-icons/react/3x2';
import { DE as DEPath } from 'country-flag-icons/string/3x2';
import IconDE from '../assets/icons/icon_flag_de.svg';

interface SwitchLanguageButtonProps {
    className?: string;
}

console.log('Path: ', DEPath);
const SwitchLanguageButton = ({ className }: SwitchLanguageButtonProps) => {
    const [showSwitchLanguage, setShowSwitchLanguage] = useState(false);

    const storageLanguage = localStorage.getItem('lernfair-language');

    const Icon = languageIcons[storageLanguage as keyof typeof languageIcons];

    return (
        <>
            <Button
                className={cn('group rounded-full hover:bg-primary-light hover:brightness-105', className)}
                onClick={() => setShowSwitchLanguage(true)}
                variant="none"
                size="icon"
            >
                <DE className={cn(`rounded-full h-6 w-6 border`)} />
            </Button>
            <SwitchLanguageModal isOpen={showSwitchLanguage} onIsOpenChange={setShowSwitchLanguage} />
        </>
    );
};

export default SwitchLanguageButton;
