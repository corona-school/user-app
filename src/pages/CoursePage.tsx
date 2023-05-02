import StudentGroup from './student/StudentGroup';
import GroupOnboarding from './student/onboarding/GroupOnboarding';
import { SCREENED_HELPER_ROLES } from '../types/lernfair/User';
import useApollo from '../hooks/useApollo';

const CoursePage = () => {
    const { refreshUser, roles } = useApollo();

    const alreadyInstructor = roles.includes('INSTRUCTOR');
    const alreadyHasOtherRoles = roles.some((role) => SCREENED_HELPER_ROLES.includes(role));
    const requestedRole = roles.includes('WANNABE_INSTRUCTOR');

    // student is already instructor and can see course page
    if (alreadyInstructor) return <StudentGroup />;

    // The support will pick the appropriate roles for the student during the screening interview,
    //  thus we want to inform the student about our group offerings but do not want them to request the role
    if (!alreadyHasOtherRoles) return <GroupOnboarding canRequest={false} loading={false} />;

    // student has requested to become an instructor and waits for the role, so a banner to inform student about the request appears
    if (requestedRole) return <GroupOnboarding waitForSupport loading={false} />; //show banner

    // student was screened and can request to become an instructor
    return <GroupOnboarding canRequest refetch={refreshUser} loading={false} />;
};

export default CoursePage;
