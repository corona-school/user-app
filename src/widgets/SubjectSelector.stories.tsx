import { SubjectSelector } from './SubjectSelector';

export default {
    title: 'Molecules/SubjectSelector',
    component: SubjectSelector,
};

export const SubjectSelectorMultiple = {
    render: () => <SubjectSelector subjects={['Mathematik', 'Englisch']} addSubject={(name) => {}} removeSubject={(name) => {}} />,

    name: 'SubjectSelector multiple',
};

export const SubjectSelectorSingle = {
    render: () => <SubjectSelector subjects={['Mathematik', 'Englisch']} addSubject={(name) => {}} removeSubject={(name) => {}} limit={1} />,

    name: 'SubjectSelector single',
};

export const SubjectSelectorSelectable = {
    render: () => (
        <SubjectSelector
            subjects={['Mathematik', 'Englisch']}
            selectable={['Mathematik', 'Englisch', 'Französisch']}
            addSubject={(name) => {}}
            removeSubject={(name) => {}}
        />
    ),

    name: 'SubjectSelector selectable',
};
