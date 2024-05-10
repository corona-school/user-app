import { InfoCard } from './InfoCard';

export default {
    title: 'Molecules/InfoCard',
    component: InfoCard,
};

export const InfoCardLoki = {
    render: () => <InfoCard icon="loki" title="Loki will dir was sagen" message="Kuckuck!" />,
    name: 'InfoCard / Loki',
};

export const InfoCardYes = {
    render: () => <InfoCard icon="yes" title="Das war erfolgreich" message="Knöpfe klicken kannst du" />,
    name: 'InfoCard / Yes',
};

export const InfoCardNo = {
    render: () => <InfoCard icon="no" title="Ne, das darfst du leider nicht" message="Nur Admins dürfen das" />,

    name: 'InfoCard / No',
};

export const InfoCardLokiWithOrangeBackground = {
    render: () => <InfoCard icon="loki" background="orange.900" title="Loki will dir was gefährliches sagen ..." message="" />,

    name: 'InfoCard / Loki with Orange Background',
};
