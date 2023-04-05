import { useQuery } from '@apollo/client';
import MatchingStudent from './student/MatchingStudent';
import MatchOnboarding from './student/onboarding/MatchOnboarding';
import { gql } from '../gql/gql';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { SCREENED_HELPER_ROLES } from '../types/lernfair/User';

const MatchPage = () => {
    const { data, loading, refetch } = useQuery(
        gql(`
            query StudentMatchRoles {
                myRoles
                me {
                    student {
                        canRequestMatch {
                            allowed
                            reason
                        }
                        
                    }
                }

                
            }
        `)
    );

    // student is already an tutor
    const alreadyTutor = data?.myRoles && data?.myRoles.includes('TUTOR');
    // student was screened and has a role
    const alreadyHasOtherRoles = data?.myRoles && !data?.myRoles.some((role: string) => SCREENED_HELPER_ROLES.includes(role));
    // student has requested to become role TUTOR
    const requestedRole = data?.me?.student?.canRequestMatch.reason === 'not-screened';

    if (loading) return <CenterLoadingSpinner />;
    // student is already tutor and can see match page
    if (alreadyTutor) return <MatchingStudent />;
    // student can't request, because was not screened and has no roles. Button does not appear.
    if (!alreadyHasOtherRoles) return <MatchOnboarding canRequest={false} />;
    // student has requested and waits to become the role TUTOR, so a banner to inform student about the request appears
    if (requestedRole) return <MatchOnboarding waitForSupport />;
    // student was screened and can request role TUTOR
    return <MatchOnboarding canRequest refetch={() => refetch()} />;
};

export default MatchPage;
