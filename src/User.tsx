import { useLocation, Navigate } from 'react-router-dom';
import CenterLoadingSpinner from './components/CenterLoadingSpinner';
import useApollo, { ExtendedApolloContext, LFApollo, useRoles } from './hooks/useApollo';
import VerifyEmailModal from './modals/VerifyEmailModal';
import { useApolloClient } from '@apollo/client';
import { ERole, Role } from './types/lernfair/User';
import { RequireScreeningModal } from './modals/RequireScreeningModal';

export const RequireAuth = ({ children, isRetainPath = true }: { children: JSX.Element; isRetainPath?: boolean }) => {
    const location = useLocation();

    const { sessionState, user, roles } = useApollo();

    if (sessionState === 'logged-out') return <Navigate to="/welcome" state={{ from: isRetainPath ? location : { pathname: '/start' } }} replace />;

    if (sessionState === 'error') return <Navigate to="/welcome" state={{ from: isRetainPath ? location : { pathname: '/start' } }} replace />;

    if (sessionState === 'unknown' || !user) return <CenterLoadingSpinner />;

    if (sessionState === 'logged-in') {
        // Blocking Modals that require the user from accessing the UserApp:

        // Require pupils and students to be verified
        if (user && !user.screener && !(user.pupil ?? user.student)!.verifiedAt) {
            return <VerifyEmailModal email={user.email} userType={user.pupil ? 'pupil' : 'student'} />;
        }

        // Require an initial screening for newly-registered pupils
        const requiresInitialScreening = ![ERole.TUTEE, ERole.PARTICIPANT, ERole.INSTRUCTOR, ERole.TUTOR].some((role) => roles.includes(role));
        if (user && (user.pupil || user.student) && requiresInitialScreening) {
            return <RequireScreeningModal />;
        }

        // Require the ethics onboarding for newly-screened students
        if (
            !location.pathname.startsWith('/onboarding/ethics/') &&
            user &&
            user.student &&
            user.student.hasDoneEthicsOnboarding === false /* Important to write it like this, as a null value must not to trigger this redirect */
        ) {
            return <Navigate to="/onboarding/ethics/welcome" replace />;
        }

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

export const VisitorsOnly = ({ children }: { children: JSX.Element }) => {
    const actualRoles = useRoles();
    const { sessionState } = useApollo();

    if (actualRoles.includes('USER') && sessionState === 'logged-in') {
        return <Navigate to="/" replace />;
    }

    return children;
};

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
        loginWithPassword: () => Promise.resolve({}),
        refreshUser: () => {},
        loginWithSSO: () => Promise.resolve(),
        refreshSessionState: () => Promise.resolve(),
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

export function MockStudent({ children }: React.PropsWithChildren<{}>) {
    const context: LFApollo = {
        client: useApolloClient() as any,
        logout: () => Promise.resolve(),
        loginWithPassword: () => Promise.resolve({}),
        refreshUser: () => {},
        loginWithSSO: () => Promise.resolve(),
        refreshSessionState: () => Promise.resolve(),
        sessionState: 'logged-in',
        roles: ['STUDENT'],
        user: {
            email: 'test+student@lern-fair.de',
            firstname: 'Max',
            lastname: 'Musterstudent',
            student: { id: 1, verifiedAt: new Date() },
            userID: 'student/1',
            pupil: null,
            screener: null,
        },
    };

    return <ExtendedApolloContext.Provider value={context} children={children} />;
}
