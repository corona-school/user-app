const appointment = {
    title: 'Termine',
    tile: { videoButton: 'Videochat beitreten', clock: 'Uhr' },
    clock: { startToEnd: '{{start}} - {{end}} Uhr', nowToEnd: 'Jetzt - {{end}} Uhr' },
    deleteModal: {
        title: 'Bist du dir sicher, dass du diesen Termin löschen möchtest?',
        description: 'Der Termin wird dadurch für alle Teilnehmer abgesagt. Du kannst dies nicht rückgängig machen.',
        delete: 'Termin löschen',
        cancel: 'Abbrechen',
    },
    createAppointment: {
        assignment: {
            header: 'Für welches Lernangebot soll dieser Termin erstellt werden?',
            noAppointments: 'Keine Termine vorhanden',
        },
        view: {
            addAppointment: 'Termin hinzufügen',
            backButton: 'zur vorherigen Seite',
        },
    },
};

export default appointment;
