import { Row } from 'native-base';
import { GradeSelector } from './GradeSelector';
import { useState } from 'react';

export default {
    title: 'Molecules/GradeSelector',
    component: GradeSelector,
};

const Render = () => {
    const [grade, setGrade] = useState(1);

    return (
        <Row flexWrap="wrap" width="100%">
            <GradeSelector grade={grade} onGradeChange={setGrade} />
        </Row>
    );
};

export const Base = {
    render: () => <Render />,

    name: 'GradeSelector',
};
