import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useLernfair from '../hooks/useLernfair';
import { NavigationItems } from '../types/navigation';
import { useRoles, useUserType } from '../hooks/useApollo';
import { useTranslation } from 'react-i18next';
import AppFeedbackModal from '../modals/AppFeedbackModal';
import { Button } from './Button';
import { Typography } from './Typography';
import { Badge } from './Badge';
import { IconStarHalfFilled } from '@tabler/icons-react';

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

    const hideForStudents = useMemo(() => {
        if (['screener', 'pupil'].includes(userType)) return true;
        return false;
    }, [userType]);

    const hideForPupils = useMemo(() => {
        if (['screener', 'student'].includes(userType)) return true;
        return false;
    }, [userType]);

    return (
        <div className="hidden md:block min-w-60">
            <nav className="flex min-w-60 flex-col h-[calc(100dvh-56px)] fixed pt-9 pb-6 justify-between shadow-lg">
                <div className="flex flex-col gap-y-4 px-4">
                    {Object.entries(navItems).map(([key, { label, icon: Icon, disabled: _disabled }]) => {
                        const disabled =
                            _disabled || (key === 'matching' && disableMatching) || (key === 'group' && disableGroup) || (key === 'chat' && disableChat);
                        const isHidden =
                            (key === 'knowledge-helper' && hideForStudents) ||
                            (key === 'knowledge-pupil' && hideForPupils) ||
                            (key === 'lesson' && userType === 'pupil');
                        if (isHidden) return null;
                        return (
                            <NavLink
                                className={({ isActive }) =>
                                    `flex items-center px-2 py-2 rounded-md hover:outline-accent hover:outline
                                            ${isActive || key === rootPath ? 'bg-accent' : ''}
                                            ${disabled ? 'opacity-20 pointer-events-none' : ''}`
                                }
                                onClick={() => setRootPath && setRootPath(`${key}`)}
                                to={`/${key}`}
                                key={key}
                            >
                                <Icon />
                                <Typography className="pl-3 mr-auto font-medium">{label}</Typography>
                                {key === 'chat' && !!unreadMessagesCount && (
                                    <Badge variant="destructive" shape="rounded" className="mr-2">
                                        {unreadMessagesCount}
                                    </Badge>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
                <Button variant="outline" className="w-4/5 self-center" leftIcon={<IconStarHalfFilled size={16} />} onClick={() => setIsOpen(true)}>
                    {t('appFeedback.giveFeedbackButton')}
                </Button>
            </nav>
            <AppFeedbackModal isOpen={isOpen} onIsOpenChange={setIsOpen} />
        </div>
    );
};
export default SideBarMenu;
