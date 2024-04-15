import { useQuery } from '@apollo/client';
import { gql } from '../../gql';
import { useTranslation } from 'react-i18next';
import WithNavigation from '../../components/WithNavigation';
import CenterLoadingSpinner from '../../components/CenterLoadingSpinner';
import { useParams } from 'react-router-dom';
import { Stack, useBreakpointValue, useTheme } from 'native-base';
import SubcourseData from '../subcourse/SubcourseData';
import { Course, Subcourse } from '../../gql/graphql';

const SingleCourseScreener: React.FC = () => {
    const { id: _subcourseId } = useParams();
    const subcourseId = parseInt(_subcourseId ?? '', 10);

    const { data, loading } = useQuery(
        gql(`
        query subcourse($subcourseId: Int!) {
            subcourse(subcourseId: $subcourseId) {
                id
                participantsCount
                maxParticipants
                minGrade
                maxGrade
                cancelled
                published
                publishedAt
                nextLecture {
                    start
                    duration
                }
                instructors {
                    id
                    firstname
                    lastname
                }
                course {
                    id
                    courseState
                    name
                    image
                    category
                    description
                    subject
                    tags {
                    name
                    }
                }
                lectures {
                    start
                    duration
                }
                appointments {
                    id
                    appointmentType
                    title
                    description
                    start
                    duration
                    displayName
                    position
                    total
                    organizers(skip: 0, take: 5) {
                    id
                    firstname
                    lastname
                    }
                    subcourse {
                    published
                    }
                }
            }
          }
          
        `),
        { variables: { subcourseId: subcourseId } }
    );

    const { t } = useTranslation();
    const { space, sizes } = useTheme();
    const sectionSpacing = useBreakpointValue({
        base: space['1'],
        lg: space['4'],
    });

    return (
        <WithNavigation showBack>
            {loading ? (
                <CenterLoadingSpinner />
            ) : (
                <Stack space={sectionSpacing} paddingX={space['1.5']}>
                    <SubcourseData course={data?.subcourse?.course as Course} subcourse={data?.subcourse as Subcourse} isInPast={false} />
                </Stack>
            )}
        </WithNavigation>
    );
};

export default SingleCourseScreener;
