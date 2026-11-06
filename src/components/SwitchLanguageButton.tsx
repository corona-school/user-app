import { useState } from 'react';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { languageListSelectionModal, switchLanguage } from '../I18n';
import { Button } from './Button';
import { cn } from '@/lib/Tailwind';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuArrow } from './Dropdown';
import { Typography } from './Typography';
import { IconLoader } from './IconLoader';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useUser } from '@/hooks/useApollo';

interface SwitchLanguageButtonProps {
    className?: string;
    variant?: 'modal' | 'dropdown';
}

const SwitchLanguageButton = ({ className, variant = 'modal' }: SwitchLanguageButtonProps) => {
    const [showSwitchLanguage, setShowSwitchLanguage] = useState(false);
    const storageLanguage = localStorage.getItem('lernfair-language');
    const user = useUser();
    const { trackEvent } = useMatomo();

    if (variant === 'modal') {
        return (
            <>
                <Button
                    className={cn('group rounded-full hover:bg-primary-light hover:brightness-105', className)}
                    onClick={() => setShowSwitchLanguage(true)}
                    variant="none"
                    size="icon"
                >
                    <span className="rounded-full">
                        <IconLoader icon={storageLanguage ?? ''} className={`rounded-full h-5 w-5`} />
                    </span>
                </Button>
                <SwitchLanguageModal
                    isOpen={showSwitchLanguage}
                    onIsOpenChange={setShowSwitchLanguage}
                    onChange={(value) => {
                        trackEvent({
                            category: `${user?.pupil ? 'SuS' : 'HuH'} User Account`,
                            action: 'Language Switcher',
                            name: 'selected',
                        });
                    }}
                />
            </>
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className={cn('group rounded-full hover:bg-primary-light hover:brightness-105', className)} variant="none" size="icon">
                        <span className="rounded-full">
                            <IconLoader icon={storageLanguage ?? ''} className={`rounded-full h-[22px] w-[22px]`} />
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-none rounded-xl flex flex-col gap-y-2 p-2">
                    <DropdownMenuArrow />
                    {languageListSelectionModal.map((button, i) => {
                        return (
                            <DropdownMenuItem
                                onClick={() => {
                                    switchLanguage(button.short);
                                    trackEvent({
                                        category: `${user?.pupil ? 'SuS' : 'HuH'} Registration`,
                                        action: 'Language Switcher',
                                        name: 'selected',
                                    });
                                }}
                                key={button.name}
                                className={cn('rounded-sm px-4 py-3', {
                                    'bg-primary-lighter hover:outline hover:!outline-[0.5px] outline outline-[0.5px] !outline-primary-light':
                                        button.short === storageLanguage,
                                })}
                            >
                                <span className="rounded-full">
                                    <IconLoader icon={button.short} className={`rounded-full h-6 w-6`} />
                                </span>
                                <Typography className="min-w-[18%] font-semibold text-left">{button.name}</Typography>
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default SwitchLanguageButton;
