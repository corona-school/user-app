const course = {
  header: 'Kurs erstellen',
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
    _4hour: '4 Stunden'
  },
  blocker: {
    student: {
      header: 'Kurs erstellen',
      title: 'Die Gruppenkurse',
      firstContent:
        'Du hilfst einer:m bildungsbenachteiligten Schüler:in im Gruppen-Format dabei, Wissenslücken zu schließen. Die Frequenz, Häufigkeit und Dauer der digitalen Treffen ist ganz euch überlassen!',
      here: 'hier',
      secContent: 'Mehr Informationen zur Gruppennachhilfe findest du',
      thrContent: 'auf unserer Webseite.',
      contentHeadline: 'Wichtig',
      content:
        'Aktuell bist du für die Gruppenkurse noch nicht freigeschaltet, aber scrolle hier durch die nächsten Prozessschritte, um herauszufinden, wie du das änderst:',
      cta: {
        title: 'Onboarding-Tour Gruppenkurs',
        content:
          'Wenn du dir noch nicht sicher bist, ob das Format der Gruppen-Nachhilfe tatsächlich zu dir passt, klick dich durch das Onboarding für den Gruppen-Nachhilfe Bereich und erhalte so eine genauere Idee von der Tätigkeit.',
        button: 'Tour starten'
      }
    },
    pupil: {
      header: 'Kurs erstellen',
      title: 'Die Gruppenkurse',
      firstContent:
        'Du benötigts individuelle Unterstützung? Dann ist die 1:1 Lernunterstützung genau richtig. Hier kannst du eine:n neue:n Student:in anfordern, die dich beim Lernen unterstützt.',
      here: 'hier',
      secContent: 'Mehr Informationen zur Gruppennachhilfe findest du',
      thrContent: 'auf unserer Webseite.',
      contentHeadline: 'Wichtig',
      content:
        'Aktuell bist du für die Gruppenkurse noch nicht freigeschaltet, aber scrolle hier durch die nächsten Prozessschritte, um herauszufinden, wie du das änderst:',
      cta: {
        title: 'Onboarding-Tour Gruppenkurs',
        content:
          'Wenn du dir noch nicht sicher bist, ob das Format der Gruppen-Nachhilfe tatsächlich zu dir passt, klick dich durch das Onboarding für den Gruppen-Nachhilfe Bereich und erhalte so eine genauere Idee von der Tätigkeit.',
        button: 'Tour starten'
      }
    }
  },
  appointments: {
    headline: 'Lege Termine für deinen Kurs fest',
    content: 'Termine erstellen*',
    addOtherAppointment: 'Weiteren Termin anlegen',
    check: 'Angaben prüfen',
    saveDraft: 'Als Entwurf speichern',
    prevPage: ' Zur vorherigen Seite'
  },
  error: {
    course:
      'Dein Kurs konnte leider nicht erstellt werden. Bitte versuche es erneut.',
    subcourse:
      'Dein Kurs konnte leider nicht erstellt werden. Bitte versuche es erneut.',
    upload_image: 'Dein Bild konnte leider nicht hochgeladen werden.',
    set_image: 'Dein Bild konnte leider nicht als Kursbild gesetzt werden.',
    instructors:
      'Ein oder mehrere Kursleiter:innen konnten nicht hinzugefügt werden.',
    lectures: 'Ein oder mehrere Termine konnten nicht hinzugefügt werden.'
  },
  CourseDate: {
    tabs: {
      course: 'Kurs',
      appointments: 'Termine',
      checker: 'Angaben prüfen'
    },
    headline: 'Allgemeine Informationen zu deinem Kurs',

    form: {
      courseNameHeadline: 'Kursname',
      courseNamePlaceholder: 'Kursname eingeben',
      courseSubjectLabel: 'Fach',
      coursePhotoLabel: 'Foto',
      courseAddOntherLeadText: 'Weitere Kursleiter hinzufügen',
      shortDescriptionLabel: 'Kurzbeschreibung',
      shortDescriptionPlaceholder:
        'Kurzer Satz, um was es in deinem Kurs geht …',
      descriptionLabel: 'Beschreibung',
      descriptionPlaceholder:
        'Präziserer Angaben um was es in deinem Kurs geht …',
      tagsLabel: 'Tags',
      tagsPlaceholder: 'Damit dein Kurs besser gefunden wird',
      tagsInfo: 'Die einzelnen Tags müssen durch ein Komma (,) getrennt werden',
      detailsHeadline: 'Details',
      detailsContent: 'Für welche Klassen ist der Kurs geeignet?',
      maxMembersLabel: 'Max Teilnehmerzahl',
      maxMembersInfo:
        'Gerne eine höhere Zahl angeben, da meist nur die Hälfte der angemeldeten Schüler:innen erscheint.',
      otherHeadline: 'Sonstiges',
      otherOptionStart: 'Teilnehmende dürfen nach Kursbeginn beitreten',
      otherOptionContact: 'Kontaktaufnahme erlauben',
      otherOptionContactToolTip:
        'Wenn du die Kontaktaufnahme erlaubst können dich die Schüler:innen die Interesse am Kurs haben oder bereits angemeldet sind Kontakt per E-Mail mit dir aufnehmen',
      button: {
        continue: 'Weiter',
        cancel: 'Abbrechen'
      }
    },
    Wizard: {
      headline: 'Termin',
      date: 'Datum',
      dateInfo: 'Ein Kurs muss 7 Tage vor Kursbeginn angelegt werden.',
      time: 'Uhrzeit',
      duration: 'Dauer',
      durationPlaceholder: 'Bessere Absprache zu UX',
      repeatAppoint: 'Termin wiederholen'
    },
    Preview: {
      yes: 'Ja',
      no: 'Nein',
      headline: 'Angaben überprüfen',
      content:
        'Bitte überpüfe deine Angaben noch einmal, bevor du deinen Kurs veröffentlichst.',
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
      membersCountLabel: 'Teilnehmerzahl:',
      membersCountMaxLabel: 'Max',
      startDateLabel: 'Beitreten nach Kursbeginn:',
      allowContactLabel: 'Kontaktaufnahme erlauben:',
      appointmentHeadline: 'Termine zum Kurs',
      appointmentLabel: 'Termin',
      appointmentDate: 'Datum:',
      appointmentTime: 'Uhrzeit:',
      appointmentDuration: 'Dauer:',
      publishCourse: 'Kurs veröffentlichen',
      editCourse: 'Daten bearbeiten'
    },
    modal: {
      headline: 'Fertig!',
      content:
        '  Vielen Dank, dein Kurs wurde gespeichert und an uns übermittelt. Nach Prüfung und Freigabe der Inhalte wird dein Kurs freigeschaltet und ist öffentlich sichtbar. Dies geschieht in den nächsten 7 Tagen.',
      button: 'weiter'
    }
  }
}

export default course
