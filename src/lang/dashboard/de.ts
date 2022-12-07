const dashboard = {
  appointmentcard: {
    header: 'Nächster Termin',

    card: {
      title: 'Mathe Grundlagen Klasse 6',
      content:
        'In diesem Kurs gehen wir die Schritte einer Kurvendiskussion von Nullstellen über Extrema bis hin zu Wendepunkten durch.',
      url: '/',
      tags: ['hallo']
    },
    hint: {
      pupil:
        'Du kannst dem Videochat erst beitreten, wenn der:die Kursleiter:in das Meeting gestartet hat.',
      student:
        'Du kannst das Meeting erst eine Stunde vor Beginn des Termins starten.'
    },
    meeting: {
      result: {
        success: 'Deine Video-Konferenz wurde erfolgreich eingetragen.',
        error: 'Deine Video-Konferenz konnt nicht eingetragen werden.'
      },
      modal: {
        title: 'Videocall starten',
        button: 'Jetzt starten',
        text: 'Trage hier den Link zur Video-Konferenz ein'
      }
    }
  },
  myappointments: {
    header: 'Meine Termine',
    linktext: 'Alle',
    noappointments: 'Es wurden keine weitere Termine gefunden.'
  },
  homework: {
    header: 'Hausaufgabenhilfe',
    title: 'Du brauchst Hife bei deinen Hausaufgaben?',
    content: 'Schreibe uns einfach an, wir helfen dir gerne.'
  },
  learningpartner: {
    header: 'Dein:e Lernpartner:in',
    username: 'Max Mustermann'
  },
  relatedcontent: {
    header: 'Vorschläge für dich'
  },
  offers: {
    header: 'Angebote',
    match: 'Match auflösen',
    noMatching: 'Du hast noch keine Matches',
    requestMatching: 'Match anfordern',
    requestCreated: 'Anfrage erstellt am:',
    clock: 'Uhr',
    waitingTimeInfo:
      'Bitte beachte dass die Suche nach einer/einem Lernpartner:in zu Wartezeiten von 3 - 6 Monaten kommen kann',
    removeRequest: 'Anfrage zurücknehmen'
  },
  helpers: {
    headlines: {
      newOffer: 'Neues Angebot',
      course: 'Meine Kurse',
      importantNews: 'Wichtige Meldungen',
      myLearningPartner: 'Meine Lernpartner:innen',
      openedRequests: 'Offene Anfragen:',
      recommend: 'Empfehle uns weiter',
      recommendFriends: 'Empfehle Lern-Fair deinen Freunden'
    },
    contents: {
      newOffer:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.',
      recommendFriends:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.'
    },
    buttons: {
      course: 'Neuen Kurs eintragen',
      offer: 'Wichtige Meldungen',
      requestMatch: 'Neues Match anfordern',
      solveMatch: 'Match auflösen',
      recommend: 'Jetzt empfehlen'
    }
  }
}
export default dashboard
