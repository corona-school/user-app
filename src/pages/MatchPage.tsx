import MatchingStudent from './student/MatchingStudent';
import MatchOnboarding from './student/onboarding/MatchOnboarding';
import { SCREENED_HELPER_ROLES } from '../types/lernfair/User';
import useApollo from '../hooks/useApollo';

const MatchPage = () => {
    const { roles, refreshUser } = useApollo();

    const alreadyTutor = roles.includes('TUTOR');
    const alreadyHasOtherRoles = roles.some((role) => SCREENED_HELPER_ROLES.includes(role));
    const requestedRole = roles.includes('WANNABE_TUTOR');

    // student is already tutor and can see match page
    if (alreadyTutor) return <MatchingStudent />;
    // student can't request, because was not screened and has no roles. Button does not appear.
    if (!alreadyHasOtherRoles) return <MatchOnboarding canRequest={false} loading={false} />;
    // student has requested and waits to become the role TUTOR, so a banner to inform student about the request appears
    if (requestedRole) return <MatchOnboarding waitForSupport loading={false} />;
    // student was screened and can request role TUTOR
    return <MatchOnboarding canRequest refetch={refreshUser} loading={false} />;
};

export default MatchPage;
