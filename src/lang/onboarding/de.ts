const onboardingList = {
  header: 'Onboarding-Tour',
  title: 'Onboarding',
  buttontext: 'Tour starten', 
  content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod',
  cards: {
    card0: {
      title: 'Du brauchst Hife bei deinen Hausaufgaben?',
      content: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.',
      url: '/'
    },
    card1: {
      title: 'Onboarding-Tour 1:1-Lernunterstützung',
      content: 'Möchtest du wissen, wie die 1:1-Lernunterstützung funktioniert? Wir zeigen dir die wichtigsten Schritte.',
      url: '/'
    },
    card2: {
      title: 'Onboarding-Tour Gruppen-Nachhilfe',
      content: 'Möchtest du wissen, wie die Gruppen-Nachhilfe funktioniert? Wir zeigen dir, was du wissen musst.',
      url: '/'
    },
    card3: {
      title: 'Onboarding-Tour Gruppen-Nachhilfe',
      content: 'Möchtest du wissen, wie die Gruppen-Nachhilfe funktioniert? Wir zeigen dir, was du wissen musst.',
      url: '/'
    },
    card4: {
      title: 'Onboarding-Tour Gruppen-Nachhilfe',
      content: 'Möchtest du wissen, wie die Gruppen-Nachhilfe funktioniert? Wir zeigen dir, was du wissen musst.',
      url: '/'
    },
  },
  Wizard: {
    students: {
      welcome: {
        title: 'Herzlich willkommen bei Lern-Fair',
        content: 'Wir freuen uns, dass du bildungs-benachteiligte Kinder aktiv unterstützen möchtest.', 
        question: 'Möchtest du sehen, was unsere Plattform alles zu bieten hat?',
        answer: 'Wir zeigen dir die wichtigsten Funktionen.',
        startTour: 'Tour starten',
        skipTour: 'Tour überspringen' 
      },
      matching: {
        title: '1:1 Lernunterstützung',
        content: 'Wenn du Einzel-Hilfe brauchst, dann ist die 1:1 Lernunterstützung das Richtige für dich. Du bekommst von uns eine:n feste:n Helfer:in.'
      },
      groupCourse: {
        title: 'Gruppen-Nachhilfe',
        content: 'In kleinen Gruppen gibt es Hilfe zu verschiedenen Themen.'
      },
      appointments: {
        title: 'Meine Termine',
        content: 'Hier findest du eine Übersicht deiner geplanten Termine.'
      },
      helpCenter: {
        title: 'Hilfebereich',
        content: 'Hier findest du häufig gestellte Fragen mit ihren Antworten. Außerdem kannst du uns hier kontaktieren'
      },
      profile: {
        title: 'Profil',
        content: 'In deinem Profil kannst du die Fächer, in denen du Hilfe brauchst, ändern.',
      },
      settings: {
        title: 'Einstellungen',
        content: 'In diesem Bereich kannst du allgemeine Änderungen und Änderungen zu deinem Konto (E-Mailadresse, Passwort) vornhemen. Zudem findet du hier auch rechliche Hinweise zur Nutzung der Plattform.'
      },
      notification: {
        title: 'Benachrichtigung',
        content: 'Du wirst über Neuigkeiten zu deinem Matching, neue Kontaktaufnahmen, allgemeine Themen informiert. Über die Glocke oben rechts siehtst du, ob du neue Nachrichten hast.'   
      },
      finisher: {
        title: 'Fertig!',
        content: 'Einen Moment, dein persönliches Dashboard wird geladen.'
      }
    },
    helper: {
      welcome: {
        title: 'Herzlich willkommen bei Lern-Fair',
        content: 'Wir freuen uns, dass du bildungs-benachteiligte Kinder aktiv unterstützen möchtest.', 
        question: 'Möchtest du sehen, was unsere Plattform alles zu bieten hat?',
        answer: 'Wir zeigen dir die wichtigsten Funktionen.',
        startTour: 'Tour starten',
        skipTour: 'Tour überspringen' 
      },
      matching: {
        title: '1:1 Matching',
        content: 'Die 1:1 Lernunterstützung ist eine 1:1 Betreuung für Schüler:innen die individuelle Hilfe benötigen. Unter diesem Punkt findest du deine Termine, deine Lernparter:innen, siehst deine angefragten Matches und kannst neue Matches anfordern.'
      },
      groupCourse: {
        title: 'Gruppenkurse',
        content: 'Gruppenkurse bieten eine kurzfristige Unterstützung bei spezifischen Problemen und Fragen. Unter „Meine Kurse“ werden alle deine Gruppenkurse angezeigt. Hier hast du auch die Möglichkeit, neue Kurse zu erstellen.'
      },
      helpCenter: {
        title: 'Hilfebereich',
        content: 'Solltest du Hilfe benötigen, findest du die wichtigsten Informationen in unserem Hilfebereich.'
      },
      profile: {
        title: 'Profil',
        content: 'In deinem Profil kannst du alles relevanten Daten eingeben.',
      },
      settings: {
        title: 'Einstellungen',
        content: 'In diesem Bereich kannst du allgemeine Änderungen und Änderungen zu deinem Konto (E-Mailadresse, Passwort) vornhemen. Zudem findet du hier auch rechliche Hinweise zur Nutzung der Plattform.'
      },
      notification: {
        title: 'Benachrichtigung',
        content: 'Du wirst über Neuigkeiten zu deinem Matching, neue Kontaktaufnahmen, allgemeine Themen informiert. Über die Glocke oben rechts siehtst du, ob du neue Nachrichten hast.'   
      },
      finisher: {
        title: 'Fertig!',
        content: 'Einen Moment, dein persönliches Dashboard wird geladen.'
      }
    },
    helperMatching: {
      welcome: {
        title: 'Onboarding-Tour 1:1 Matching',
        content: 'Wir zeigen dir hier alle wichtigen Informationen, die du über das 1:1 Matching wissen musst.', 
        question: 'Wie fordere ich ein Match an? Wie nehme ich Kontakt mit meinem/meiner Lernpartner:in auf? Wir kann ich ein Match auflösen?',
        answer: 'Wir zeigen dir die wichtigsten Funktionen.',
        startTour: 'Tour starten',
        skipTour: 'Tour überspringen' 
      },
      matching: {
        title: 'Match anfordern',
        content: 'Über den Button „Match anfordern“ auf dem  Dashboard oder im Bereich 1:1 Lernunterstützung kannst du ein neues Match anfordern.'
      },
      request: {
        title: 'Anfrage stellen',
        content: 'Damit wir dir eine:n optimale:n Lernpartner:in zuteilen können, benötigen wir ein paar Informationen über dich und dein Angebot.'
      },
      match: {
        title: 'Matching',
        content: 'Nachdem du deine Anfrage gestellt hast, begeben wir uns auf die Suche nach einem/einer passenden Lernpartner:in für dich. Du kannst deine Anfrage auch jederzeit zurücknehmen. Unter dem Punkt Anfragen im Bereich 1:1 Lernunterstützung sind alle deine Anfragen aufgeführt. '
      },
      contact: {
        title: 'Kontaktaufnahme',
        content: 'Wurdest du gematcht kannst du deine:n Lernpartner:in direkt über den Button „Kontakt aufnehmen“ in der Benachrichtigung kontaktieren. Möchtest du deine:n Lernpartner:in zu einen späteren Zeitpunkt kontaktieren, kannst du dies auch über das Profil deines/deiner Lernpartners/Lernpartnerin tun.',
      },
      matchSolve: {
        title: 'Match auflösen',
        content: 'Solltest du ein Match auflösen wollen, kannst du dies unter dem Punkt 1:1 Lernunterstützung unter Matches über den Button „Match auflösen“ tun.'
      },
      finisher: {
        title: 'Geschafft',
        firstContent: 'Super, du hast die Onboarding-Tour zum 1:1 Matching abgeschlossen.',
        headlineContent: 'Hast du alles verstanden?',
        answer: 'Du kannst dir die Tour nochmal ansehen oder in unserem Hilfebreich vorbeischauen. Hier findest du die wichtigsten Informationen und Hilfestellungen für dich als Helfer:in.',
        linkText: 'Zum Hilfebereich',
        buttonText: 'Tour beenden',
        buttonLinkText: 'Tour nochmal ansehen'
      }
    }
  }
}
export default onboardingList
