import { useState } from 'react';
import { EnumSelector } from './EnumSelector';
import { Screening_Jobstatus_Enum } from '../gql/graphql';

const Selector = EnumSelector(Screening_Jobstatus_Enum, (k) => `job_status.${k}`);

export default {
    title: 'Molecules/EnumSelector',
    component: EnumSelector,
};

const RenderBase = () => {
    const [value, setValue] = useState(Screening_Jobstatus_Enum.Employee);
    return <Selector value={value} setValue={setValue} />;
};

export const Base = {
    render: () => <RenderBase />,

    name: 'EnumSelector',
};
