import { SubjectTag, SubjectTagList } from './SubjectTag';

export default {
    title: 'Molecules/SubjectTag',
    component: SubjectTag,
};

export const BaseSubjectTag = {
    render: () => (
        <SubjectTag
            subject={{
                name: 'Deutsch',
            }}
        />
    ),

    name: 'SubjectTag',
};

export const SubjectTagWithGradeRestriction = {
    render: () => (
        <SubjectTag
            subject={{
                name: 'Mathematik',

                grade: {
                    min: 5,
                    max: 10,
                },
            }}
        />
    ),

    name: 'SubjectTag with grade restriction',
};

export const SubjectTagWithMandatoryFlag = {
    render: () => (
        <SubjectTag
            subject={{
                name: 'Englisch',
                mandatory: true,
            }}
        />
    ),

    name: 'SubjectTag with mandatory flag',
};

export const BaseSubjectTagList = {
    render: () => (
        <SubjectTagList
            subjects={[
                {
                    name: 'Deutsch',
                },
                {
                    name: 'Italienisch',
                },
            ]}
        />
    ),

    name: 'SubjectTagList',
};
