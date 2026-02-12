import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useTheme, VStack, Column, useBreakpointValue } from 'native-base';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import WithNavigation from '../components/WithNavigation';
import useApollo, { useUserType } from '../hooks/useApollo';
import DeactivateAccountModal from '../modals/DeactivateAccountModal';
import ListItem from '../widgets/ListItem';
import ProfileSettingRow from '../widgets/ProfileSettingRow';
import { SwitchLanguageModal } from '../modals/SwitchLanguageModal';
import { GAMIFICATION_ACTIVE, LESSON_PLAN_GENERATOR_ACTIVE, REFERRALS_ACTIVE } from '../config';
import { InstallationContext } from '../context/InstallationProvider';
import { Breadcrumb } from '@/components/Breadcrumb';
import { IconChevronRight, IconUser, IconX, IconBell } from '@tabler/icons-react';
import { Button } from '@/components/Button';
import { Separator } from '@/components/Separator';

const Settings: React.FC = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, roles } = useApollo();
    const tabspace = 3;
    const { trackPageView, trackEvent } = useMatomo();
    const userType = useUserType();
    const { canInstall } = useContext(InstallationContext);

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

    return (
        <>
            <WithNavigation
                headerTitle={t('settings.header')}
                hideMenu
                previousFallbackRoute="/start"
                headerRight={
                    <Button className="rounded-full hover:bg-primary-light hover:brightness-105" variant="none" onClick={() => navigate(-1)} size="icon">
                        <IconX />
                    </Button>
                }
            >
                <div className={'text-2xl font-bold py-2'}>Meine Einstellungen</div>
                <Separator className="my-3 w-full" />
                <div id={'sidebar'}>
                    <div className="hidden md:block min-w-72">
                        <nav className="flex min-w-72 flex-col h-full fixed  pb-6 justify-between">
                            <div className="flex flex-col gap-y-4 ">
                                <SettingRow title={''}>
                                    <SettingItem title={'Profil'} Icon={IconUser} link={'/profile'} />
                                    <SettingItem title={'Benachrichtigungen'} Icon={IconBell} link={'/profile'} />
                                </SettingRow>
                                <SettingRow title={'Allgemein'}>
                                    <SettingItem title={'Profil'} Icon={IconUser} link={'/profile'} />
                                    <SettingItem title={'Profil'} Icon={IconUser} link={'/profile'} />
                                </SettingRow>
                            </div>
                        </nav>
                    </div>
                </div>

                <VStack paddingX={space['1.5']} space={space['1']} marginX="auto" width="100%" maxWidth={ContainerWidth}>
                    <Breadcrumb />
                    <>
                        <ProfileSettingRow title={user?.firstname!} isSpace={false}>
                            {userType !== 'screener' && (
                                <>
                                    <Column mb={tabspace}>
                                        <ListItem label={t('settings.general.profile')} onPress={() => navigate('/profile')} />
                                    </Column>
                                    <Column mb={tabspace}>
                                        <ListItem label={t('settings.general.calendarPreferences')} onPress={() => navigate('/calendar-preferences')} />
                                    </Column>
                                    <Column mb={tabspace}>
                                        <ListItem label={t('settings.general.notifications')} onPress={() => navigate('/notifications')} />
                                    </Column>
                                </>
                            )}
                            {userType === 'student' && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.certificates')} onPress={() => navigate('/certificates')} />
                                </Column>
                            )}
                        </ProfileSettingRow>
                        <ProfileSettingRow title={t('settings.general.title')} isSpace={false}>
                            {GAMIFICATION_ACTIVE && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.progress')} onPress={() => navigate('/progress')} />
                                </Column>
                            )}
                            <Column mb={tabspace}>
                                <ListItem label={t('settings.general.faq')} onPress={() => navigate('/hilfebereich')} />
                            </Column>
                            {canInstall && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('installation.installTitle')} onPress={handleOnInstall} />
                                </Column>
                            )}
                            <Column mb={tabspace}>
                                <ListItem label={t('settings.general.manageSessions')} onPress={() => navigate('/manage-sessions')} />
                            </Column>
                            {userType === 'student' && isMobile && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.forStudents')} onPress={() => navigate('/knowledge-helper')} />
                                </Column>
                            )}
                            {userType === 'pupil' && isMobile && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.general.forPupils')} onPress={() => navigate('/knowledge-pupil')} />
                                </Column>
                            )}
                            {/* Add Lesson for both desktop and mobile */}
                            {LESSON_PLAN_GENERATOR_ACTIVE && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('navigation.label.lesson')} onPress={() => navigate('/lesson')} />
                                </Column>
                            )}
                            {/* Move Referral to Knowledge Center on Mobile Only */}
                            {isMobile && REFERRALS_ACTIVE && (
                                <Column mb={tabspace}>
                                    <ListItem label={t('navigation.label.referral')} onPress={() => navigate('/referral')} />
                                </Column>
                            )}
                        </ProfileSettingRow>
                    </>
                    <ProfileSettingRow title={t('settings.account.title')} isSpace={false}>
                        {!roles.includes('SSO_USER') && (
                            <>
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.account.changeEmail')} onPress={() => navigate('/new-email')} />
                                </Column>
                                <Column mb={tabspace}>
                                    <ListItem label={t('settings.account.changePassword')} onPress={() => navigate('/new-password')} />
                                </Column>
                            </>
                        )}

                        <Column mb={tabspace}>
                            <ListItem label={t('settings.account.deactivateAccount')} onPress={() => setShowDeactivate(true)} />
                        </Column>
                        <Column mb={tabspace}>
                            <ListItem
                                label={t('settings.account.logout')}
                                onPress={() => {
                                    trackEvent({
                                        category: 'profil',
                                        action: 'click-event',
                                        name: 'Abmelden im Account',
                                        documentTitle: 'Logout',
                                    });
                                    navigate('/logout');
                                }}
                            />
                        </Column>
                    </ProfileSettingRow>
                    <ProfileSettingRow title={t('settings.legal.title')} isSpace={false}>
                        <Column mb={tabspace}>
                            <ListItem label={t('settings.legal.imprint')} onPress={() => navigate('/impressum')} />
                        </Column>
                        <Column mb={tabspace}>
                            <ListItem label={t('settings.legal.datapolicy')} onPress={() => navigate('/datenschutz')} />
                        </Column>
                        <Column mb={tabspace}>
                            <ListItem label={t('settings.legal.agb')} onPress={() => navigate(`/${userType === 'pupil' ? 'agb-schueler' : 'agb-helfer'}`)} />
                        </Column>
                    </ProfileSettingRow>
                </VStack>
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
            <div className={'text-sm mb-3'}>{title}</div>
            <div className={'flex flex-col gap-2 mb-5'}>{children}</div>
            <Separator className="my-2 w-full" />
        </div>
    );
};

const SettingItem = ({ title, Icon, link }: { title: string; Icon: React.ElementType; link: string }) => {
    const navigate = useNavigate();
    return (
        <div className="inline-flex items-center gap-3 hover:bg-accent rounded-md px-2 py-1 cursor-pointer" onClick={() => navigate(link)}>
            <Icon size={22} className="text-primary" />
            <span>{title}</span>
            <div className={'ml-auto'}>
                <IconChevronRight />
            </div>
        </div>
    );
};
