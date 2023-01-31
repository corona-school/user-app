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
        assignmentHeader: 'Für welches Lernangebot soll dieser Termin erstellt werden?',
        noAppointments: 'Keine Termine vorhanden',
        addAppointmentButton: 'Termin hinzufügen',
        backButton: 'zur vorherigen Seite',
        lecture: 'Lektion',
        titleLabel: 'Titel',
        dateLabel: 'Datum',
        timeLabel: 'Uhrzeit',
        durationLabel: 'Dauer',
        descriptionLabel: 'Beschreibung (optional)',
        descriptionPlaceholder: 'Das ist eine Beschreibung',
        inputPlaceholder: 'z.B. Thema XYZ',
        weeklyRepeat: 'wöchentlich wiederholen...',
        emptyFieldError: 'Textfeld darf nicht leer sein',
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
};

export default appointment;
