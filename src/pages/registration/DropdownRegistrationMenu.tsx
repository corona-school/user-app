import { Button } from '@/components/Button';
import { DropdownMenu, DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/Dropdown';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { ContactSupportModal } from '@/modals/ContactSupportModal';
import DeactivateAccountModal from '@/modals/DeactivateAccountModal';
import NotificationPreferencesModal from '@/modals/NotificationPreferencesModal';
import { IconMenu2, IconBell, IconLifebuoy, IconUserOff, IconLogout } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRegistrationForm } from './useRegistrationForm';

export const DropdownRegistrationMenu = () => {
    const { reset } = useRegistrationForm();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isContactSupportOpen, setIsContactSupportOpen] = useState(false);
    const [isNotificationPreferencesOpen, setIsNotificationPreferencesOpen] = useState(false);
    const [isDeactivateAccountOpen, setIsDeactivateAccountOpen] = useState(false);

    const handleOnLogout = () => {
        navigate('/logout');
        reset();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className={cn('group rounded-full hover:bg-primary-light hover:brightness-105')} variant="none" size="icon">
                        <span className="rounded-full">
                            <IconMenu2 className={`rounded-full h-5 w-5`} />
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-none rounded-xl flex flex-col gap-y-2 p-2 min-w-[235px]">
                    <DropdownMenuArrow />
                    <DropdownMenuItem className="gap-x-[10px] h-12" onClick={() => setIsNotificationPreferencesOpen(true)}>
                        <IconBell className="!size-6" />
                        <Typography className="font-semibold leading-3">{t('registration.menu.notifications')}</Typography>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-[10px] h-12" onClick={() => setIsContactSupportOpen(true)}>
                        <IconLifebuoy className="!size-6" />
                        <Typography className="font-semibold leading-3">{t('registration.menu.contactSupport')}</Typography>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-[10px] h-12" onClick={() => setIsDeactivateAccountOpen(true)}>
                        <IconUserOff className="!size-6" />
                        <Typography className="font-semibold leading-3">{t('registration.menu.deactivateAccount')}</Typography>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-x-[10px] h-12" onClick={handleOnLogout}>
                        <IconLogout className="!size-6" />
                        <Typography className="font-semibold leading-3">{t('registration.menu.logout')}</Typography>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeactivateAccountModal isOpen={isDeactivateAccountOpen} onOpenChange={setIsDeactivateAccountOpen} onDeactivated={reset} />
            <NotificationPreferencesModal isOpen={isNotificationPreferencesOpen} onOpenChange={setIsNotificationPreferencesOpen} />
            <ContactSupportModal isOpen={isContactSupportOpen} onOpenChange={setIsContactSupportOpen} />
        </>
    );
};
