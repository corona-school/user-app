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
        years: 'Jahre',
        hours: 'Stunde(n)',
        status: {
            free: 'Freie Plätze',
            last: 'Nur noch {{seatsLeft}} freie Plätze',
            full: 'Ausgebucht',
        },
        noMembers: 'Es sind noch keine Teilnehmer:innen vorhanden.',
        noLections: 'Es wurden keine Lektionen eingetragen.',
    },
    tabs: {
        description: 'Beschreibung',
        lessons: 'Lektionen',
        participant: 'Teilnehmer:innen',
    },
    card: {
        expandCardButton: 'Mehr Kurs-Infos',
        alreadyRegistered: 'Du bist bereits für diesen Kurs angemeldet.',
        waitingListMember: 'Du bist bereits auf der Warteliste dieses Kurses',
        appointments: '{{count}} Termin(e)',
        time: {
            notStarted: 'Startet:',
            ongoing: 'Läuft seit',
            ended: 'Schon vorbei',
        },
    },
    contact: {
        instructor: 'Kursleiter:innen kontaktieren',
        participants: 'Teilnehmer:innen kontaktieren',
    },
    courseInfo: {
        grade: 'Jahrgangsstufe: ',
        class: 'Klasse {{minGrade}} - {{maxGrade}}',
        editCourse: 'Kurs editieren',
    },
    actions: {
        leaveSubcourse: 'Kurs verlassen',
        joinWaitinglist: ' Auf Warteliste setzen',
        leaveWaitinglist: 'Warteliste verlassen',
        contactInstructor: 'Kursleiter:in kontaktieren',
        videochat: 'Zum Videochat',
        videochatShouldOpen: 'Der Videochat sollte sich in einem neuen Tab öffnen. Falls nicht probiere den folgenden Knopf:',
        openVideochatAgain: 'Videochat erneut öffnen',
        startVideochat: 'Du kannst das Meeting erst eine Stunde vor Beginn des Termins starten.',
    },
    modals: {
        headline: 'Kursinformationen',
        signInSuccess: 'Du hast dich nun erfolgreich zum Kurs angemeldet.',
        sureToLeave: 'Bist du sicher, dass du dich von diesem Kurs abmelden möchtest? Du kannst anschließend nicht mehr am Kurs teilnehmen.',
        leaveCourse: 'Vom Kurs abmelden',
        isOnWaitinglist: 'Du bist auf der Warteliste!',
        leaveWaitinglistSuccess: 'Du hast die Warteliste erfolgreich verlassen.',
        close: 'Fenster schließen',
        contactMessage: {
            alertParticipants: ' Wir teilen deinen Teilnehmer:innen deine E-Mail-Adresse mit, sodass ihr bei Bedarf via E-Mail weiter kommunizieren könnt.',
            alertInstructors: ' Wir teilen deinen Kursleiter:innen deine E-Mail-Adresse mit, sodass ihr bei Bedarf via E-Mail weiter kommunizieren könnt.',
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
};
export default single;
