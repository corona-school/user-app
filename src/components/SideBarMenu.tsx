import { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useLernfair from '../hooks/useLernfair';
import { NavigationItems } from '../types/navigation';
import { useRoles, useUserType } from '../hooks/useApollo';
import { useTranslation } from 'react-i18next';
import AppFeedbackModal from '../modals/AppFeedbackModal';
import { Button } from './Button';
import { Typography } from './Typography';
import { Badge } from './Badge';
import { IconStarHalfFilled, IconListCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useCooperations } from '@/pages/screening/useCooperations';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { cn } from '@/lib/Tailwind';

type Props = {
    navItems: NavigationItems;
    unreadMessagesCount?: number;
};

const SideBarMenu: React.FC<Props> = ({ navItems, unreadMessagesCount }) => {
    const { t } = useTranslation();
    const { rootPath, setRootPath } = useLernfair();
    const userType = useUserType();
    const userRoles = useRoles();
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useLocalStorage<boolean>({ key: 'sidebar-collapsed', initialValue: false });
    const { pendingCooperationStudentsCount } = useCooperations();
    const location = useLocation();

    const canCollapse = userType === 'screener';
    const collapsed = canCollapse && isCollapsed;

    const disableGroup: boolean = useMemo(() => {
        if (userType === 'screener') return !userRoles.includes('COURSE_SCREENER');
        if (userType === 'pupil') return !userRoles.includes('PARTICIPANT');
        return false;
    }, [userRoles, userType]);

    const disableChat: boolean = useMemo(() => {
        if (userType === 'screener') return true;
        return false;
    }, [userType]);

    const disableMatching: boolean = useMemo(() => {
        if (userType === 'screener') return true;
        if (userType === 'pupil') return !userRoles.includes('TUTEE');
        return false;
    }, [userRoles, userType]);

    const hideStudentsKnowledgeCenter = useMemo(() => {
        if (['screener', 'pupil'].includes(userType)) return true;
        return false;
    }, [userType]);

    const hidePupilsKnowledgeCenter = useMemo(() => {
        if (['screener', 'student'].includes(userType)) return true;
        return false;
    }, [userType]);

    const hideNavItemForUserType = (route: string) => {
        if (userType === 'screener') {
            return ['matching', 'chat', 'referral', 'appointments'].includes(route);
        }
        return false;
    };

    return (
        <div className={cn('hidden md:block', collapsed ? 'w-16' : 'min-w-60')}>
            <nav className={cn('flex flex-col h-[calc(100dvh-56px)] fixed pt-9 pb-6 justify-between shadow-lg', collapsed ? 'w-16' : 'min-w-60')}>
                {canCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-0 z-10 translate-x-1/2 h-8 w-8 rounded-full bg-white text-primary shadow-md border border-gray-200 hover:bg-gray-50"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        onClick={() => setIsCollapsed(!collapsed)}
                    >
                        {collapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
                    </Button>
                )}
                <div className={cn('flex flex-col gap-y-4', collapsed ? 'px-2' : 'px-4', canCollapse && 'pt-2')}>
                    {Object.entries(navItems).map(([key, { label, icon: Icon, disabled: _disabled }]) => {
                        const disabled =
                            _disabled || (key === 'matching' && disableMatching) || (key === 'group' && disableGroup) || (key === 'chat' && disableChat);
                        const isHidden =
                            (key === 'knowledge-helper' && hideStudentsKnowledgeCenter) ||
                            (key === 'knowledge-pupil' && hidePupilsKnowledgeCenter) ||
                            (key === 'lesson' && userType === 'pupil') ||
                            hideNavItemForUserType(key);
                        if (isHidden) return null;
                        return (
                            <NavLink
                                className={({ isActive }) =>
                                    `relative flex items-center px-2 py-2 rounded-md hover:outline-accent hover:outline
                                            ${collapsed ? 'justify-center' : ''}
                                            ${isActive || key === rootPath ? 'bg-accent' : ''}
                                            ${disabled ? 'opacity-20 pointer-events-none' : ''}`
                                }
                                onClick={() => setRootPath && setRootPath(`${key}`)}
                                to={`/${key}`}
                                key={key}
                                title={collapsed ? label : undefined}
                                aria-label={collapsed ? label : undefined}
                                reloadDocument={userType === 'screener' && key === 'start' && location.pathname === '/start'}
                            >
                                <Icon />
                                {!collapsed && <Typography className="pl-3 mr-auto font-medium">{label}</Typography>}
                                {key === 'chat' && !!unreadMessagesCount && (
                                    <Badge variant="destructive" shape="rounded" className={collapsed ? 'absolute -top-1 -right-1' : 'mr-2'}>
                                        {unreadMessagesCount}
                                    </Badge>
                                )}
                            </NavLink>
                        );
                    })}
                    {userRoles.includes('STUDENT_SCREENER') && (
                        <NavLink
                            className={({ isActive }) =>
                                `relative flex items-center px-2 py-2 rounded-md hover:outline-accent hover:outline
                                            ${collapsed ? 'justify-center' : ''}
                                            ${isActive || rootPath === 'cooperation-helpers' ? 'bg-accent' : ''}`
                            }
                            onClick={() => setRootPath && setRootPath('cooperation-helpers')}
                            to={`/cooperation-helpers`}
                            title={collapsed ? 'Kooperationen' : undefined}
                            aria-label={collapsed ? 'Kooperationen' : undefined}
                        >
                            <IconListCheck />
                            {!collapsed && <Typography className="pl-3 mr-auto font-medium">Kooperationen</Typography>}
                            {pendingCooperationStudentsCount > 0 && (
                                <Badge variant="destructive" shape="rounded" className={collapsed ? 'absolute -top-1 -right-1' : 'mr-2'}>
                                    {pendingCooperationStudentsCount}
                                </Badge>
                            )}
                        </NavLink>
                    )}
                </div>
                {collapsed ? (
                    <Button
                        variant="outline"
                        size="icon"
                        className="self-center"
                        aria-label={t('appFeedback.giveFeedbackButton')}
                        title={t('appFeedback.giveFeedbackButton')}
                        onClick={() => setIsOpen(true)}
                    >
                        <IconStarHalfFilled size={16} />
                    </Button>
                ) : (
                    <Button variant="outline" className="w-4/5 self-center" leftIcon={<IconStarHalfFilled size={16} />} onClick={() => setIsOpen(true)}>
                        {t('appFeedback.giveFeedbackButton')}
                    </Button>
                )}
            </nav>
            <AppFeedbackModal isOpen={isOpen} onIsOpenChange={setIsOpen} />
        </div>
    );
};
export default SideBarMenu;
