const course = {
    header: 'Kurs erstellen',
    edit: 'Kurs bearbeiten',
    uploadImage: 'Foto hochladen',
    noticeDate: 'Bitte fülle alle Felder korrekt aus',
    selectPlaceHolderDuration: 'Dauer auswählen',
    selectOptions: {
        _15minutes: '15 Minuten',
        _30minutes: '30 Minuten',
        _45minutes: '45 Minuten',
        _1hour: '1 Stunde',
        _90minutes: '90 Minuten',
        _2hour: '2 Stunden',
        _3hour: '3 Stunden',
        _4hour: '4 Stunden',
    },

    meeting: {
        videobutton: {
            pupil: 'Videochat beitreten',
            student: 'Videochat starten',
        },
        videotext: 'Videochat noch nicht gestartet.',
        videotooltip: {
            pupil: 'Der Videochat noch nicht gestartet oder du hast keine Berechtigung diesen aufzurufen.',
            student: 'Der Videochat kann noch nicht gestartet werden',
        },
        result: {
            success: 'Deine Video-Konferenz wurde erfolgreich eingetragen.',
            error: 'Deine Video-Konferenz konnt nicht eingetragen werden.',
        },
        modal: {
            title: 'Videocall starten',
            button: 'Jetzt starten',
            text: 'Trage hier den Link zur Video-Konferenz ein',
        },
        hint: {
            pupil: 'Du kannst dem Videochat erst beitreten, wenn der:die Kursleiter:in das Meeting gestartet hat.',
            student: 'Du kannst das Meeting erst eine Stunde vor Beginn des Termins starten.',
        },
    },
    blocker: {
        student: {
            header: 'Kurs erstellen',
            title: 'Die Gruppen-Kurse',
            firstContent:
                'Du hilfst einer:m bildungsbenachteiligten Schüler:in im Gruppen-Format dabei, Wissenslücken zu schließen. Die Frequenz, Häufigkeit und Dauer der digitalen Treffen ist ganz euch überlassen!',
            here: 'hier',
            secContent: 'Mehr Informationen zu unseren Nachhilfe-Kursen findest du',
            thrContent: 'auf unserer Webseite.',
            contentHeadline: 'Wichtig',
            content:
                'Aktuell bist du für die Gruppen-Kurse noch nicht freigeschaltet, aber scrolle hier durch die nächsten Prozessschritte, um herauszufinden, wie du das änderst:',
            cta: {
                title: 'Onboarding-Tour Gruppen-Kurse',
                content:
                    'Wenn du dir noch nicht sicher bist, ob das Format der Nachhilfe-Kurse tatsächlich zu dir passt, klick dich durch das Onboarding für die Gruppen-Nachhilfe und erhalte so eine genauere Idee von der Tätigkeit.',
                button: 'Tour starten',
            },
        },
    },
    appointments: {
        headline: 'Wann soll der Kurs stattfinden?',
        content: 'Termin erstellen',
        addOtherAppointment: 'Weiteren Termin anlegen',
        check: 'Angaben prüfen',
        saveDraft: 'Als Entwurf speichern',
        prevPage: ' Zur vorherigen Seite',
        existingAppointments: 'Bestehende Termin(e)',
    },
    error: {
        course: 'Dein Kurs konnte leider nicht erstellt werden. Bitte versuche es erneut.',
        subcourse: 'Dein Kurs konnte leider nicht erstellt werden. Bitte versuche es erneut.',
        upload_image: 'Dein Bild konnte leider nicht hochgeladen werden.',
        set_image: 'Dein Bild konnte leider nicht als Kursbild gesetzt werden.',
        instructors: 'Ein oder mehrere Kursleiter:innen konnten nicht hinzugefügt werden.',
        lectures: 'Ein oder mehrere Termine konnten nicht hinzugefügt werden.',
        tags: 'Deine Tags konnten nicht hinzugefügt werden.',
    },
    CourseDate: {
        headline: 'Allgemeine Informationen zu deinem Kurs',
        step: {
            general: 'Allgemeine Informationen',
            subject: 'Einordnung',
            attendees: 'Teilnehmer:innen',
            appointments: 'Termin(e)',
            settings: 'Einstellungen',
            checker: 'Überprüfung',
        },
        form: {
            courseNameHeadline: 'Kursname',
            courseNamePlaceholder: 'Kursname eingeben',
            courseCategory: 'Kategorie',
            categoryPlaceholder: 'Bitte wähle eine Kategorie',
            revision: 'Nachhilfe-Kurs',
            language: 'Deutsch-Kurs',
            focus: 'Fokus-Kurs',
            courseSubjectLabel: 'Fach',
            coursePhotoLabel: 'Foto',
            changeImage: 'Bild ändern',
            CourseInstructors: 'Kursleiter:innen',
            courseAddOntherLeadText: 'Weitere Kursleiter:innen hinzufügen',
            courseAlreadyaAddedLead: 'Du hast diese Person bereits hinzugefügt.',
            shortDescriptionLabel: 'Kurzbeschreibung',
            shortDescriptionPlaceholder: 'Kurzer Satz, um was es in deinem Kurs geht …',
            descriptionLabel: 'Beschreibung',
            descriptionPlaceholder: 'Beschreibung des Kurses',
            tagsLabel: 'Tags',
            tagsEdit: 'Tags bearbeiten',
            tagsPlaceholder: 'Damit dein Kurs besser gefunden wird',
            tagsInfo: 'Die einzelnen Tags müssen durch ein Komma (,) getrennt werden',
            detailsHeadline: 'Details',
            detailsContent: 'Für welche Klassen ist der Kurs geeignet?',
            classRange: 'Klassen {{minRange}} - {{maxRange}}',
            maxMembersLabel: 'Max. Teilnehmer:innenzahl',
            maxMembersInfo: 'Gerne eine höhere Zahl angeben, da meist nur die Hälfte der angemeldeten Schüler:innen erscheint.',
            otherHeadline: 'Sonstiges',
            otherContactHeadline: 'Kontaktaufnahme',
            otherOptionStart: 'Schüler:innen können sich nach dem ersten Kurstermin anmelden',
            otherProspects: 'Interessent:innen',
            otherParticipants: 'Teilnehmer:innen',
            otherOptionContact: 'Kontaktaufnahme erlauben',
            otherGroupChatHeadline: 'Gruppen- bzw. Ankündigungchat',
            allowChatContact: 'Teilnehmer:innen erlauben in den Chat zu schreiben',
            prospectContactTooltip: 'Schüler:innen, die sich für deinen Kurs interessieren (vor Kursbeginn)',
            participantsContactTooltip: 'Schüler:innen, die sich für deinen Kurs angemeldet haben',
            otherOptionStartToolTip:
                'Wenn du diese Option aktivierst, können sich Schüler:innen jederzeit zu deinem Kurs anmelden. Sie können sich insbesondere auch dann anmelden, wenn bereits eine oder mehrere Lektionen stattgefunden haben.',
            otherOptionContactToolTip:
                'Wenn du die Kontaktaufnahme erlaubst, können Schüler:innen, die Interesse am Kurs haben oder bereits angemeldet sind, Kontakt per E-Mail mit dir aufnehmen',
        },
        tags: {
            header: 'Tags wählen',
            choosenTags: 'Ausgewählte Tags',
            furtherTags: 'Weitere Tags',
            noTagsFound: 'Keine Tags gefunden',
        },
        Wizard: {
            headline: 'Termin',
            date: 'Datum',
            dateInfo: 'Ein Kurs muss 7 Tage vor Kursbeginn angelegt werden.',
            durationPlaceholder: 'Bessere Absprache zu UX',
            repeatAppoint: 'Termin wiederholen',
        },
        Image: {
            resetPhoto: 'Bild zurücksetzen',
            deletePhoto: 'Bild löschen',
        },
        Preview: {
            yes: 'Ja',
            no: 'Nein',
            headline: 'Angaben überprüfen',
            content: 'Bitte überprüfe die Angaben noch einmal, bevor du deinen Kurs veröffentlichst.',
            infoHeadline: 'Allgemeine Informationen zu deinem Kurs',
            courseName: 'Kursname:',
            courseSubject: 'Fach',
            shortDesc: 'Kurzbeschreibung',
            desc: 'Beschreibung',
            tagHeadline: 'Tags',
            classHeadline: 'Klassen',
            image: 'Bild',
            notags: 'Es wurden keine Tags angegeben.',
            jahrgangsstufe: 'Jahrgangsstufe',
            membersCountLabel: 'Teilnehmer:innenzahl:',
            membersCountMaxLabel: 'Max. {{membersCount}}',
            startDateLabel: 'Beitreten nach Kursbeginn:',
            allowContactLabel: 'Kontaktaufnahme erlauben:',
            appointmentHeadline: 'Termin(e) zum Kurs',
            appointmentLabel: 'Termin',
            appointmentDate: 'Datum:',
            publishCourse: 'Zur Prüfung freigeben',
            saveCourse: 'Kurs erstellen und später freigeben',
            editCourse: 'Daten bearbeiten',
            updateCourse: 'Änderungen speichern',
        },
        modal: {
            headline: 'Fertig!',
            content:
                '  Vielen Dank, dein Kurs wurde gespeichert und an uns übermittelt. Nach Prüfung und Freigabe der Inhalte wird dein Kurs freigeschaltet und ist öffentlich sichtbar. Dies geschieht in den nächsten 7 Tagen.',
        },
    },
    unsplash: {
        heading: 'Wähle ein Bild',
        placeholder: 'Kursthema eingeben',
        description: 'Suche ein aussagekräftiges Bild für dein Kursthema mithilfe der Suchleiste. Es können aktuell keine eigenen Bilder verwendet werden.',
        noSearchoResults: 'Keine Suchergebnisse.',
        choose: 'wählen',
    },
    addCourseInstructor: {
        search: 'Name oder E-Mail-Adresse',
        notFound: 'Keine Suchergebnisse - Gebe den vollen Namen oder die E-Mail der Kursleiterin ein um sie zu finden',
    },
    empty: {
        nocourses: 'Du bietest zur Zeit keinen Kurs an.',
        noremissionordraft: 'Du hast derzeit keinen Kurs-Entwurf und keinen Kurs zur Prüfung freigegeben.',
        nopastcourses: 'Du hast bisher noch keinen Kurs bei uns angeboten.',
    },
    cancel: {
        header: 'Kurs absagen',
        description:
            'Wenn du den Kurs absagst, werden alle Termine abgesagt und die teilnehmenden Schüler:innen über diese Änderung per E-Mail informiert. Bist du dir sicher, dass du den Kurs absagen möchtest?',
    },
};

export default course;
