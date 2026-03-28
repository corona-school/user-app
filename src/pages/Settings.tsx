import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useTheme, VStack, Column, useBreakpointValue } from 'native-base';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import WithNavigation from '../components/WithNavigation';
import useApollo, { useUserType } from '../hooks/useApollo';
import DeactivateAccountModal from '../modals/DeactivateAccountModal';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { InstallationContext } from '../context/InstallationProvider';
import { GAMIFICATION_ACTIVE, LESSON_PLAN_GENERATOR_ACTIVE, REFERRALS_ACTIVE } from '../config';
import {
    IconChevronRight,
    IconUser,
    IconX,
    IconBell,
    IconCalendarWeek,
    IconCertificate,
    IconTrophy,
    IconHelpCircle,
    IconDownload,
    IconSectionSign,
    IconShieldLock,
    IconLicense,
    IconMail,
    IconPassword,
    IconUserOff,
    IconLogout,
    IconDevices,
    IconBook2,
    IconSpeakerphone,
} from '@tabler/icons-react';
import { Button } from '@/components/Button';
import { Separator } from '@/components/Separator';
import { Typography } from '@/components/Typography';

interface SettingItemType {
    title: string;
    icon: React.ElementType;
    mobileFallbackLink: string;
    element?: JSX.Element;
    onClick?: () => void;
}

const Settings: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, roles } = useApollo();
    const tabspace = 3;
    const { trackPageView, trackEvent } = useMatomo();
    const userType = useUserType();
    const { canInstall } = useContext(InstallationContext);

    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastLinkItem = pathSegments[pathSegments.length - 1];

    const [showDeactivate, setShowDeactivate] = useState(false);
    const [showSwitchLanguage, setShowSwitchLanguage] = useState(false);

    useEffect(() => {
        trackPageView({
            documentTitle: 'Einstellungen',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const handleOnInstall = () => {
        navigate('/install');
    };

    const profileSettings: SettingItemType[] = [
        ...(userType !== 'screener'
            ? [
                  { title: t('settings.general.profile'), icon: IconUser, mobileFallbackLink: '/profile' },
                  { title: t('settings.general.notifications'), icon: IconBell, mobileFallbackLink: '/notifications' },
                  {
                      title: t('settings.general.calendarPreferences'),
                      icon: IconCalendarWeek,
                      mobileFallbackLink: '/calendar-preferences',
                  },
              ]
            : []),
        ...(userType === 'student' ? [{ title: t('settings.general.certificates'), icon: IconCertificate, mobileFallbackLink: '/certificates' }] : []),
    ];

    const generalSettings: SettingItemType[] = [
        ...(GAMIFICATION_ACTIVE
            ? [
                  {
                      title: t('settings.general.progress'),
                      icon: IconTrophy,
                      mobileFallbackLink: '/progress',
                  },
              ]
            : []),
        {
            title: t('settings.general.faq'),
            icon: IconHelpCircle,
            mobileFallbackLink: '/hilfebereich',
        },
        {
            title: t('installation.installTitle'),
            icon: IconDownload,
            mobileFallbackLink: '/install',
        },
        {
            title: t('settings.general.manageSessions'),
            icon: IconDevices,
            mobileFallbackLink: '/manage-sessions',
        },
        ...(userType === 'student' && isMobile ? [{ title: t('settings.general.forStudents'), icon: IconBook2, mobileFallbackLink: '/knowledge-helper' }] : []),
        ...(userType === 'pupil' && isMobile ? [{ title: t('settings.general.forPupils'), icon: IconBook2, mobileFallbackLink: '/knowledge-pupil' }] : []),
        ...(LESSON_PLAN_GENERATOR_ACTIVE ? [{ title: t('navigation.label.lesson'), icon: IconDownload, mobileFallbackLink: '/lesson' }] : []),
        ...(isMobile && REFERRALS_ACTIVE ? [{ title: t('navigation.label.referral'), icon: IconSpeakerphone, mobileFallbackLink: '/referral' }] : []),
    ];

    const accountSettings: SettingItemType[] = [
        ...(!roles.includes('SSO_USER')
            ? [
                  { title: t('settings.account.changeEmail'), icon: IconMail, mobileFallbackLink: '/new-email' },
                  { title: t('settings.account.changePassword'), icon: IconPassword, mobileFallbackLink: '/new-password' },
              ]
            : []),
        { title: t('settings.account.deactivateAccount'), icon: IconUserOff, mobileFallbackLink: '#', onClick: () => setShowDeactivate(true) },
        {
            title: t('settings.account.logout'),
            icon: IconLogout,
            mobileFallbackLink: '#',
            onClick: () => {
                trackEvent({
                    category: 'profil',
                    action: 'click-event',
                    name: 'Abmelden im Account',
                    documentTitle: 'Logout',
                });
                navigate('/logout');
            },
        },
    ];

    const legalSettings: SettingItemType[] = [
        { title: t('settings.legal.imprint'), icon: IconSectionSign, mobileFallbackLink: '/impressum' },
        { title: t('settings.legal.datapolicy'), icon: IconShieldLock, mobileFallbackLink: '/datenschutz' },
        { title: t('settings.legal.agb'), icon: IconLicense, mobileFallbackLink: `/${userType === 'pupil' ? 'agb-schueler' : 'agb-helfer'}` },
    ];

    const settings = [
        { title: '', items: profileSettings },
        { title: t('settings.general.title'), items: generalSettings },
        { title: t('settings.account.title'), items: accountSettings },
        { title: t('settings.legal.title'), items: legalSettings },
    ];

    return (
        <>
            <WithNavigation
                headerTitle={t('settings.header')}
                hideMenu
                previousFallbackRoute="/settings"
                headerRight={
                    <Button className="rounded-full hover:bg-primary-light hover:brightness-105" variant="none" onClick={() => navigate(-1)} size="icon">
                        <IconX />
                    </Button>
                }
            >
                <Typography variant={'h3'} className={'mt-4 mb-11'}>
                    {t('settings.general.mySettings')}
                </Typography>
                <div id={'sidebar'}>
                    <div className="min-w-full md:min-w-72">
                        <nav className="flex md:min-w-72 min-w-full pr-8 flex-col h-[calc(100vh-120px)] overflow-y-auto fixed pb-10 justify-between">
                            <div className="flex flex-col gap-y-4 ">
                                {settings.map((group) => {
                                    return (
                                        <SettingRow title={group.title}>
                                            {group.items.map((item) => {
                                                return (
                                                    <SettingItem
                                                        title={item.title}
                                                        Icon={item.icon}
                                                        active={'/' + lastLinkItem === item.mobileFallbackLink}
                                                        onClick={item.onClick ? item.onClick : () => navigate(item.mobileFallbackLink)}
                                                    />
                                                );
                                            })}
                                        </SettingRow>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                </div>
                <div className={'ml-auto w-full lg:w-[80%] pl-4'}>
                    <Outlet />
                </div>
            </WithNavigation>
            <DeactivateAccountModal isOpen={showDeactivate} onOpenChange={setShowDeactivate} />
            <SwitchLanguageModal isOpen={showSwitchLanguage} onIsOpenChange={setShowSwitchLanguage} />
        </>
    );
};
export default Settings;

const SettingRow = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className={'w-full'}>
            <Typography variant={'sm'} className={'mb-3'}>
                {title}
            </Typography>
            <div className={'flex flex-col gap-2 mb-5'}>{children}</div>
        </div>
    );
};

const SettingItem = ({ title, Icon, onClick, active }: { title: string; Icon: React.ElementType; onClick: () => void; active: boolean }) => {
    return (
        <div
            className={`inline-flex items-center gap-3 hover:bg-accent rounded-md px-2 py-1 cursor-pointer ${active ? 'bg-accent text-tertiary' : ''}`}
            onClick={onClick}
        >
            <Icon size={20} className="text-primary" />
            <Typography variant={'subtle'} className={'font-medium'}>
                {title}
            </Typography>
            <div className={'ml-auto'}>
                <IconChevronRight />
            </div>
        </div>
    );
};
