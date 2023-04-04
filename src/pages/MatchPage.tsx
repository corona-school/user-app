import { useQuery } from '@apollo/client';
import MatchingStudent from './student/MatchingStudent';
import MatchOnboarding from './student/onboarding/MatchOnboarding';
import { gql } from '../gql/gql';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';

const MatchPage = () => {
    const { data, loading } = useQuery(
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

    const ROLES = ['TUTOR'];

    if (loading) return <CenterLoadingSpinner />;
    if (data?.myRoles && data?.myRoles.includes('TUTOR')) return <MatchingStudent />;
    if (data?.myRoles && !data?.myRoles.some((role: string) => ROLES.includes(role))) return <MatchOnboarding canRequest={false} />;
    if (data?.me?.student?.canRequestMatch.reason === 'not-screened') return <MatchOnboarding waitForSupport />;
    return <MatchOnboarding canRequest />;
};

export default MatchPage;
