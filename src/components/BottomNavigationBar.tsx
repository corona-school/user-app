import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { NavigationItems } from '../types/navigation';
import useLernfair from '../hooks/useLernfair';
import { useRoles, useUserType } from '../hooks/useApollo';
import { Typography } from './Typography';
import { Badge } from './Badge';

type Props = {
    navItems: NavigationItems;
    unreadMessagesCount?: number;
};

const BottomNavigationBar: React.FC<Props> = ({ navItems, unreadMessagesCount }) => {
    const { rootPath, setRootPath } = useLernfair();
    const userType = useUserType();
    const userRoles = useRoles();

    const disableGroup: boolean = useMemo(() => {
        if (userType === 'screener') return !userRoles.includes('COURSE_SCREENER');
        if (userType === 'pupil') return !userRoles.includes('PARTICIPANT');
        return false;
    }, [userType, userRoles]);

    const disableChat: boolean = useMemo(() => {
        if (userType === 'screener') return true;
        return false;
    }, [userType]);

    const disableMatching: boolean = useMemo(() => {
        if (userType === 'screener') return true;
        if (userType === 'pupil') return !userRoles.includes('TUTEE');
        return false;
    }, [userType, userRoles]);

    return (
        <nav className="md:hidden pb-[calc(env(safe-area-inset-bottom)/2)] pt-[calc(env(safe-area-inset-bottom)/3)] sticky flex w-full min-h-16 left-0 right-0 bottom-0 justify-between items-center px-8 bg-white shadow-bottomNavigation">
            {Object.entries(navItems).map(([key, { label, icon: Icon, disabled: _disabled }]) => {
                const disabled = _disabled || (key === 'matching' && disableMatching) || (key === 'group' && disableGroup) || (key === 'chat' && disableChat);

                const isHidden = ['knowledge-helper', 'knowledge-pupil', 'referral'].includes(key);
                if (isHidden) return null;

                return (
                    <NavLink
                        className={`flex flex-col items-center relative justify-between ${disabled ? 'opacity-20 pointer-events-none' : ''}`}
                        onClick={() => setRootPath && setRootPath(`${key}`)}
                        to={`/${key}`}
                        key={key}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`p-1 ${isActive || key === rootPath ? 'bg-accent rounded-full' : ''}`}>
                                    <Icon size={20} />
                                </div>
                                <Typography variant="sm" className="font-medium">
                                    {label}
                                </Typography>
                                {key === 'chat' && !!unreadMessagesCount && (
                                    <Badge variant="destructive" shape="rounded" className="absolute top-[-4px] right-[-5px] size-4">
                                        {unreadMessagesCount}
                                    </Badge>
                                )}
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
};
export default BottomNavigationBar;
