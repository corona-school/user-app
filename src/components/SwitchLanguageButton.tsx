import { useState } from 'react';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { languageIcons } from '../I18n';
import { Button } from './Button';
import { cn } from '@/lib/Tailwind';

interface SwitchLanguageButtonProps {
    className?: string;
}

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
                <span className={`fi ${Icon} bg-center bg-cover rounded-full h-7 w-7`}></span>
            </Button>
            <SwitchLanguageModal isOpen={showSwitchLanguage} onIsOpenChange={setShowSwitchLanguage} />
        </>
    );
};

export default SwitchLanguageButton;
