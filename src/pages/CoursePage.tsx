import { useQuery } from '@apollo/client';
import { gql } from '../gql/gql';
import StudentGroup from './student/StudentGroup';
import GroupOnboarding from './student/onboarding/GroupOnboarding';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

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

    const ROLES = ['INSTRUCTOR', 'STUDENT'];
    if (loading) return <CenterLoadingSpinner />;
    if (data?.myRoles && data?.myRoles.includes('INSTRUCTOR')) return <StudentGroup />;
    if (data?.myRoles && !data?.myRoles.some((role) => ROLES.includes(role))) return <GroupOnboarding canRequest={false} />; //noButton
    if (data?.me?.student?.canCreateCourse.reason === 'not-screened') return <GroupOnboarding waitForSupport />; //show banner
    return <GroupOnboarding canRequest refetch={() => refetch()} />;
};

export default CoursePage;
