import { useLocation, Navigate } from 'react-router-dom';
import CenterLoadingSpinner from './components/CenterLoadingSpinner';
import useApollo from './hooks/useApollo';
import VerifyEmailModal from './modals/VerifyEmailModal';

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
