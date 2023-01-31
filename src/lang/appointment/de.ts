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
    appointmentDetail: {
        group: 'Gruppentermin mit {{instructor}}',
        oneToOne: 'Einzeltermin mit {{instructor}}',
        without: 'Termin mit {{instructor}}',
        appointmentTitle: '{{appointmentTitle}}',
        courseTitle: 'Kurs: {{courseTitle}}',
        time: '{{start}} - {{end}} Uhr ({{duration}} Minuten)',
        repeatDate: '{{appointmentCount}}. von insgesamt {{appointmentsTotal}} Terminen',
        participants: '{{participantsTotal}} Teilnehmer:innen',
        videochatButton: 'Jetzt Videochat beitreten',
        desciptionHeader: 'Beschreibung',
        courseDescriptionHeader: 'Kursbeschreibung: {{courseTitle}}',
        deleteButton: 'Termin löschen',
        cancelButton: 'Termin absagen',
        editButton: 'Termin bearbeiten',
        canceledToast: 'Termin wurde abgesagt',
    },
    attendeesModal: {
        title: 'Teilnehmer:innen',
        closeButton: 'Schließen',
        helper: 'Helfer:in',
        pupil: 'Schüler:in',
    },
};

export default appointment;
