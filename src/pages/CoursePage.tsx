import { useQuery } from '@apollo/client';
import { gql } from '../gql/gql';
import StudentGroup from './student/StudentGroup';
import GroupOnboarding from './student/onboarding/GroupOnboarding';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { SCREENED_HELPER_ROLES } from '../types/lernfair/User';

const CoursePage = () => {
    const { data, loading, refetch } = useQuery(
        gql(`
            query StudentCourseRoles {
                myRoles
                me {
                    student {
                        canCreateCourse {
                            allowed
                            reason
                        }
                        
                    }
                }

                
            }
        `)
    );

    // student is already an instructor
    const alreadyInstructor = data?.myRoles && data?.myRoles.includes('INSTRUCTOR');
    // student was screened and has role STUDENT
    const alreadyHasOtherRoles = data?.myRoles.some((role: string) => SCREENED_HELPER_ROLES.includes(role));
    // student has requested to become an instructor
    const requestedRole = data?.myRoles && data?.me?.student?.canCreateCourse.reason === 'not-screened';

    if (loading) return <CenterLoadingSpinner />;

    // student is already instructor and can see course page
    if (alreadyInstructor) return <StudentGroup />;

    // student can't request, because was not screened and has no roles. Button does not appear.
    if (!alreadyHasOtherRoles) return <GroupOnboarding canRequest={false} />;

    // student has requested to become an instructor and waits for become the role, so a banner to inform student about the request appears
    if (requestedRole) return <GroupOnboarding waitForSupport />; //show banner

    // student was screened and can request to become an instructor
    return <GroupOnboarding canRequest refetch={() => refetch()} />;
};

export default CoursePage;
