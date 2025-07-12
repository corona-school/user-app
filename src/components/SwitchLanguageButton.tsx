import { useState } from 'react';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { languageIcons, languageListSelectionModal, switchLanguage } from '../I18n';
import { Button } from './Button';
import { cn } from '@/lib/Tailwind';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuArrow } from './Dropdown';

interface SwitchLanguageButtonProps {
    className?: string;
    variant?: 'modal' | 'dropdown';
}

const SwitchLanguageButton = ({ className, variant = 'modal' }: SwitchLanguageButtonProps) => {
    const [showSwitchLanguage, setShowSwitchLanguage] = useState(false);
    const storageLanguage = localStorage.getItem('lernfair-language');
    const Icon = languageIcons[storageLanguage as keyof typeof languageIcons];

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className={cn('group rounded-full hover:bg-primary-light hover:brightness-105', className)}
                        onClick={() => setShowSwitchLanguage(true)}
                        variant="none"
                        size="icon"
                    >
                        <Icon className={cn(`rounded-full h-5 w-5`)} />
                    </Button>
                </DropdownMenuTrigger>
                {variant === 'dropdown' && (
                    <DropdownMenuContent align="end" className="border-none p-2">
                        <DropdownMenuArrow />
                        {languageListSelectionModal.map((button, i) => {
                            const Icon = languageIcons[button.short as keyof typeof languageIcons];

                            return (
                                <DropdownMenuItem onClick={() => switchLanguage(button.short)} key={button.name} className="rounded-sm">
                                    <Icon className={`mr-2 rounded-full h-5 w-5 border`} />
                                    <span className="min-w-[18%] text-left">{button.name}</span>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                )}
            </DropdownMenu>
            {variant === 'modal' && <SwitchLanguageModal isOpen={showSwitchLanguage} onIsOpenChange={setShowSwitchLanguage} />}
        </>
    );
};

export default SwitchLanguageButton;
