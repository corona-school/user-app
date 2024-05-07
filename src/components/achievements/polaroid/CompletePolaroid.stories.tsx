import CompletePolaroid from './CompletePolaroid';
import KanufahrtDschungel from '../../../assets/images/achievements/KanufahrtDschungel.png';

export default {
    title: 'Organisms/Achievements/Polaroid/CompletePolaroid',
    component: CompletePolaroid,
};

export const CompletePolaroidImage = {
    render: () => <CompletePolaroid alternativeText="Text" image={KanufahrtDschungel} />,
    name: 'Complete Polaroid Image',
};
