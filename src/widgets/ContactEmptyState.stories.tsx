import ContactEmptyState from './ContactEmptyState';

export default {
    title: 'Organisms/Chat/ContactEmptyState',
    component: ContactEmptyState,
};

export const Base = {
    render: () => (
        <ContactEmptyState
            title="Keine Kontaktoptionen"
            subtitle="Hier werden dir deine Lernpaare und Gruppenchats aufgelistet, mit denen du Chatten kannst."
        />
    ),

    name: 'ContactEmptyState',
};
