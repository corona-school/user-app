import { Course_Coursestate_Enum } from '../gql/graphql';
import CourseBanner from './CourseBanner';

export default {
    title: 'Organisms/Courses/CourseBanner',
    component: CourseBanner,
};

export const Base = {
    render: () => (
        <CourseBanner
            courseState={Course_Coursestate_Enum.Allowed}
            isCourseCancelled={false}
            isPublished
            handleButtonClick={() => console.log('handle click')}
        />
    ),

    name: 'CourseBanner',
};
