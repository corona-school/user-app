const appointments = {
    singleAppointment: {
        group: 'Gruppentermin mit {{instructor}}',
        single: 'Einzeltermin mit {{instructor}}',
        without: 'Termin mit {{instructor}}',
        lecture: 'Lektion {{appointmentCount}}: {{lecture}}',
        title: 'Kurs: {{courseTitle}}',
        time: '{{start}} - {{end}} Uhr ({{duration}})',
        repeateDate: '{{appointmentCount}}. von insgesamt {{appointmentsTotal}} Terminen',
        participants: '{{participantsTotal}} Teilnehmer:innen',
        videochatButton: 'Jetzt Videochat beitreten',
        descriptionTitle: 'Kursbeschreibung: {{courseTitle}}',
        deleteAppointmentButton: 'Termin löschen',
        cancelAppointmentButton: 'Termin absagen',
        adjustAppointmentButton: 'Termin bearbeiten',
    },
    attendeesModal: {
        title: 'Teilnehmer:innen',
        closeButton: 'Schließen',
        helper: 'Helfer:in',
        pupil: 'Schüler:in',
    },
};

export default appointments;
