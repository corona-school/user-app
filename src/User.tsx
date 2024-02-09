import { useLocation, Navigate } from 'react-router-dom';
import CenterLoadingSpinner from './components/CenterLoadingSpinner';
import useApollo, { ExtendedApolloContext, LFApollo, useRoles } from './hooks/useApollo';
import VerifyEmailModal from './modals/VerifyEmailModal';
import { useApolloClient } from '@apollo/client';
import { Role } from './types/lernfair/User';

export const RequireAuth = ({ children, isRetainPath }: { children: JSX.Element; isRetainPath?: boolean }) => {
    const location = useLocation();

    const { sessionState, user } = useApollo();

    if (sessionState === 'logged-out') return <Navigate to="/welcome" state={{ from: isRetainPath ? location : { pathname: '/start' } }} replace />;

    if (sessionState === 'error') return <Navigate to="/welcome" state={{ from: isRetainPath ? location : { pathname: '/start' } }} replace />;

    if (sessionState === 'unknown' || !user) return <CenterLoadingSpinner />;

    if (sessionState === 'logged-in') {
        if (user && !user.screener && !(user.pupil ?? user.student)!.verifiedAt) return <VerifyEmailModal email={user.email} />;

        return children;
    }

    return <Navigate to="/welcome" state={{ from: location }} replace />;
};

// Always wrap in a RequireAuth component
export function RequireRole({ roles, children }: { roles: Role[]; children: JSX.Element }) {
    const actualRoles = useRoles();

    if (roles.some((role) => actualRoles.includes(role))) {
        return children;
    }

    return <Navigate to="/" replace />;
}

export const SwitchUserType = ({
    pupilComponent,
    studentComponent,
    screenerComponent,
}: {
    pupilComponent?: JSX.Element;
    studentComponent?: JSX.Element;
    screenerComponent?: JSX.Element;
}) => {
    const location = useLocation();
    const { sessionState, user } = useApollo();

    if (sessionState === 'logged-out') return <Navigate to="/welcome" state={{ from: location }} replace />;

    if (sessionState === 'error') return <Navigate to="/welcome" state={{ from: location }} replace />;

    if (sessionState === 'unknown' || !user) return <CenterLoadingSpinner />;

    if (user!.student) {
        if (studentComponent) return studentComponent;
        else return <Navigate to="/start" state={{ from: location }} replace />;
    } else if (user!.pupil) {
        if (pupilComponent) return pupilComponent;
        else return <Navigate to="/start" state={{ from: location }} replace />;
    } else {
        if (screenerComponent) return screenerComponent;
        else return <Navigate to="/start" state={{ from: location }} replace />;
    }
};

// -------- Mocks for Storybook & Tests -----------------

export function MockScreener({ children }: React.PropsWithChildren<{}>) {
    const context: LFApollo = {
        client: useApolloClient() as any,
        logout: () => Promise.resolve(),
        onLogin: () => {},
        loginWithPassword: () => Promise.resolve({}),
        refreshUser: () => {},
        sessionState: 'logged-in',
        roles: ['SCREENER', 'TRUSTED_SCREENER'],
        user: {
            email: 'test+screener@lern-fair.de',
            firstname: 'Max',
            lastname: 'Musterscreener',
            screener: { id: 1 },
            userID: 'screener/1',
            pupil: null,
            student: null,
        },
    };

    return <ExtendedApolloContext.Provider value={context} children={children} />;
}
