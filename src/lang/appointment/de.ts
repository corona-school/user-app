const appointment = {
    title: 'Termine',
    saveChanges: 'Änderungen speichern',
    editSuccess: 'Termin erfolgreich geändert',
    deleteAppointment: 'Termin löschen',
    goBack: 'zur vorherigen Seite',
    loadPastAppointments: 'Vergangene Termine laden',
    empty: {
        noAppointments: 'Keine Termine',
        noAppointmentsDesc: 'Dir wurden aktuell noch keine Termine zugeordnet.',
        noFurtherAppointments: 'Keine weiteren Termine',
        noFurtherDesc: 'Scrolle nach oben, um vergangene Termine zu sehen.',
        createNewAppointmentDesc: 'Erstelle nun den ersten Kurstermin.',
        noPublishedAppointmentsDesc: 'Es wurden noch keine Termine veröffentlicht.',
    },
    tile: { videoButton: 'Videochat beitreten', clock: 'Uhr' },
    clock: { startToEnd: '{{start}} - {{end}} Uhr', nowToEnd: 'Jetzt - {{end}} Uhr' },
    deleteModal: {
        title: 'Bist du dir sicher, dass du diesen Termin löschen möchtest?',
        description: 'Der Termin wird dadurch für alle Teilnehmer:innen abgesagt. Du kannst dies nicht rückgängig machen.',
        delete: 'Termin löschen',
        cancel: 'Abbrechen',
    },
    declineModal: {
        title: 'Bist du dir sicher, dass du diesen Termin absagen möchtest?',
        description: 'Du kannst dem Termin nicht wieder beitreten.',
        decline: 'Termin absagen',
    },
    appointmentTile: {
        lecture: 'Lektion #{{position}}',
        title: ': {{appointmentTitle}}',
    },
    create: {
        assignmentHeader: 'Für welches Lernangebot soll dieser Termin erstellt werden?',
        insightMatchHeader: 'Deine bestehenden Termine mit {{matchPartner}}.',
        insightCourseHeader: 'Deine bestehenden Termine für {{courseTitle}}.',
        noAppointments: 'Keine Termine vorhanden',
        oneToOneTitle: 'Einzel',
        assignmentProgress: 'Zuordnung wählen',
        appointmentViewProgress: 'Termine einsehen',
        appointmentAdd: 'Termin hinzufügen',
        group: 'Gruppe',
        date: 'Ab {{date}} • {{time}} Uhr',
        addAppointmentButton: 'Termin(e) hinzufügen',
        backButton: 'zur vorherigen Seite',
        lecture: 'Lektion',
        titleLabel: 'Titel',
        dateLabel: 'Datum',
        timeLabel: 'Uhrzeit',
        durationLabel: 'Dauer',
        descriptionLabel: 'Beschreibung (optional)',
        descriptionPlaceholder: 'Füge eine prägnante und verständliche Beschreibung hinzu...',
        inputPlaceholder: 'Thema (optional)',
        weeklyRepeat: 'wöchentlich wiederholen...',
        emptyFieldError: 'Title darf nicht leer sein',
        emptySelectError: 'Auswahl darf nicht leer sein',
        emptyDateError: 'Datum darf nicht leer sein',
        wrongDateError: 'Datum kann frühestens in einer Woche sein',
        emptyTimeError: 'Zeit darf nicht leer sein',
        courseImageAltText: 'Kursbild',
    },
    detail: {
        group: 'Gruppentermin mit {{instructor}}',
        oneToOne: 'Einzeltermin mit {{instructor}}',
        without: 'Termin mit {{instructor}}',
        appointmentTitle: '{{appointmentTitle}}',
        courseName: 'Kurs: {{courseName}}',
        time: '{{start}} - {{end}} Uhr ({{duration}} Minuten)',
        repeatDate: '{{appointmentCount}}. von insgesamt {{appointmentsTotal}} Terminen',
        participants: '{{participantsTotal}} Teilnehmer:innen',
        videochatButton: 'Jetzt Videochat beitreten',
        descriptionHeader: 'Beschreibung',
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
    errors: {
        title: 'Title darf nicht leer sein',
        date: 'Datum darf nicht leer sein',
        dateMinOneWeek: 'Datum kann frühestens in einer Woche sein',
        timeNotInFiveMin: 'Zeit kann frühestens in 5 Minuten sein',
        time: 'Zeit darf nicht leer sein',
        duration: 'Dauer darf nicht leer sein',
    },
};

export default appointment;
