const single = {
    global: {
        clockFrom: 'Ab',
        from: 'aus',
        clock: 'Uhr',
        category: 'Kategorie',
        participating: 'Teilnehmer:innen',
        quantity: 'Anzahl',
        lesson: 'Lektion',
        lessons: 'Lektionen',
        duration: 'Dauer',
        tutor: 'Tutor:innen',
        more_tutors: 'Weitere Tutor:innen',
        hours: 'Stunde(n)',
        state: 'Status:',
        status: {
            free: 'Freie Plätze',
            last: 'Nur noch {{seatsLeft}} freie Plätze',
            lastSeats: '{{seatsFull}} von {{seatsMax}} Plätzen belegt',
            full: 'Ausgebucht',
        },
        courseState: {
            publish: 'Öffentlich',
            cancelled: 'Abgesagt',
            denied: 'Abgelehnt',
            draft: 'Entwurf',
            submitted: 'In Prüfung',
        },
        noMembers: 'Es sind noch keine Teilnehmer:innen vorhanden.',
        noLections: 'Es wurden keine Lektionen eingetragen.',
        leaveCourse: 'Kurs verlassen',
        signOut: 'Vom Kurs abmelden',
    },
    tabs: {
        description: 'Beschreibung',
        lessons: 'Lektionen',
        waitinglist: 'Warteliste',
        participant: 'Teilnehmer:innen',
    },
    courseInfo: {
        grade: 'Jahrgangsstufe: ',
        class: 'Klasse {{minGrade}} - {{maxGrade}}',
        editCourse: 'Kurs editieren',
        courseInPast: 'Dieser Kurs ist bereits vorbei.',
        courseCancelled: 'Dieser Kurs wurde abgesagt.',
    },
    card: {
        expandCardButton: 'Mehr Infos',
        alreadyRegistered: 'Du bist bereits für diesen Kurs angemeldet.',
        waitingListMember: 'Du bist bereits auf der Warteliste dieses Kurses',
        appointments: '{{count}} Termin(e)',
        dateLectures: '{{date}}, {{time}} Uhr',
        time: {
            notStarted: 'Startet:',
            ongoing: 'Läuft seit',
            ended: 'Schon vorbei',
        },
    },
    contact: {
        participants: 'Teilnehmer:innen kontaktieren',
        messageSend: 'Nachricht erfolgreich versendet',
        failedToSend: 'Deine Nachricht konnte nicht versendet werden',
    },
    actions: {
        leaveSubcourse: 'Kurs verlassen',
        joinWaitinglist: ' Auf Warteliste setzen',
        leaveWaitinglist: 'Warteliste verlassen',
        contactInstructor: 'Kursleiter:in kontaktieren',
        videochat: 'Videochat starten',
        videochatShouldOpen: 'Der Videochat sollte sich in einem neuen Tab öffnen. Falls nicht probiere den folgenden Knopf:',
        openVideochatAgain: 'Videochat erneut öffnen',
    },
    modals: {
        contactMessage: {
            alertParticipants: ' Wir teilen deinen Kursleiter:innen deine E-Mail-Adresse mit, sodass ihr bei Bedarf via E-Mail weiter kommunizieren könnt.',
            alertInstructors: ' Wir teilen deinen Schüler:innen deine E-Mail-Adresse mit, sodass ihr bei Bedarf via E-Mail weiter kommunizieren könnt.',
        },
    },
    buttonPromote: {
        button: 'Kurs bewerben',
        toast: 'Kurs beworben',
        toastFail: 'Dein Kurs konnte nicht beworben werden',
    },
    bannerPromote: {
        freeTitle: 'Auf freie Plätze aufmerksam machen?',
        freeDescription: 'Benachrichtige (einmalig) passende Schüler:innen.',
        promotedTitle: 'Dein Kurs wurde erneut beworben!',
        promotedDescription: 'Schüler:innen mit den entsprechenden Interessen wurden benachrichtigt.',
        participant: 'Teilnehmer:innen',
    },
    banner: {
        state: 'Status: ',
        created: {
            draft: 'Entwurf',
            button: 'Zur Prüfung freischalten',
            info: 'Dein Kurs ist derzeit noch ein Entwurf. Schüler:innen können deinen Kurs nicht sehen. Bevor der Kurs veröffentlicht werden kann, muss dieser zur Prüfung für das Lern-Fair Team freigegeben werden.',
        },
        submitted: {
            isChecked: 'In Prüfung',
            info: 'Dein Kurs wird derzeit von uns überprüft. Wenn die Überprüfung erfolgreich war, wird dein Kurs automatisch von uns veröffentlicht. Schüler:innen können sich anschließend direkt zu deinem Kurs anmelden.',
        },
        allowedNotPublished: {
            checked: 'Überprüfung erfolgreich',
            button: 'Kurs veröffentlichen',
            info: 'Dein Kurs wurde erfolgreich von uns überprüft. Du kannst den Kurs nun veröffentlichen und damit zur Anmeldung für Schüler:innen freigeben.',
        },
        allowedAndPublished: {
            published: 'Veröffentlicht',
            button: 'Kurs absagen',
            info: 'Dein Kurs ist öffentlich sichtbar. Schüler:innen können sich zu deinem Kurs anmelden, wenn sie in der für deinen Kurs vorgesehenen Jahrgangsstufe sind.',
        },
        rejected: {
            state: 'Abgelehnt',
            button: 'Support kontaktieren',
            info: 'Dein Kurs wurde von uns überprüft, aber abgelehnt. Der Kurs ist nicht öffentlich sichtbar und Schüler:innen können sich nicht für diesen Kurs anmelden. Bei Rückfragen oder Problemen, melde dich bei unserem Support.',
        },
    },
    signIn: {
        button: 'Verbindlich anmelden',
        description:
            'Schön, dass du dich zu diesem Kurs <b>verbindlich</b> anmelden möchtest.\nUnsere Helfer:innen bieten die Kurse freiwillig und ehrenamtlich an. Komme daher bitte pünktlich und sage ab, falls du doch nicht kommen kannst.',
        toast: 'Du hast dich erfolgreich zu dem Kurs angemeldet.',
        error: 'Du konntest nicht zu dem Kurs angemeldet werden.',
    },
    joinWaitinglist: {
        button: 'Auf Warteliste setzen',
        description: 'Möchtest du dich auf die Warteliste setzen?',
        toast: 'Du bist auf der Warteliste!',
    },
    leave: {
        course: 'Kurs verlassen',
        signOut: 'Vom Kurs abmelden',
        description: 'Bist du sicher, dass du dich von diesem Kurs abmelden möchtest? Du kannst anschließend nicht mehr am Kurs teilnehmen.',
        toast: 'Du hast dich nun erfolgreich vom Kurs abgemeldet.',
    },
    leaveWaitinglist: {
        button: 'Warteliste verlassen',
        description: 'Bist du sicher, dass du dich von dieser Warteliste streichen möchtest?',
        toast: 'Du hast die Warteliste erfolgreich verlassen.',
    },
    waitinglist: {
        toast: 'Schüler wurde dem Kurs hinzugefügt.',
        error: 'Schüler:in konnte nicht hinzugefügt werden.',
        onwaitinglist: 'Auf Warteliste setzen',
        leaveWaitinglist: 'Warteliste verlassen',
        leaveSuccess: 'Du hast die Warteliste erfolgreich verlassen.',
        joined: 'Du wurdest der Warteliste für diesen Kurs erfolgreich hinzugefügt.',
        joinMember: 'Du bist auf der Warteliste für diesen Kurs.',
        noPupilsOnWaitinglist: 'Keine Schüler:innen auf der Warteliste.',
        modal: {
            info: 'Wir informieren dich per E-Mail, wenn ein Platz für dich in diesem Kurs frei-geworden ist. Möchtest du dich auf die Warteliste setzen?',
            success: 'Du bist auf der Warteliste!',
            button: 'Auf die Warteliste',
            cancel: 'Abbrechen',
        },
    },
    joinPupilModal: {
        header: 'Schüler:innen nachrücken',
        add: 'Hinzufügen',
        amount: 'Anzahl Schüler:innen',
        success: 'Schüler:innen erfolgreich hinzugefügt',
    },
};

export default single;
