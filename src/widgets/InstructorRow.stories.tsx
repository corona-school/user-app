import InstructorRow from './InstructorRow';

export default {
    title: 'Organisms/Courses/InstructorRow',
    component: InstructorRow,
};

export const Base = {
    render: () => (
        <InstructorRow
            instructor={{
                firstname: 'Jane',
                lastname: 'Doe',
            }}
            onPressDelete={() => {}}
            onPress={() => {}}
        />
    ),

    name: 'InstructorRow',
};
