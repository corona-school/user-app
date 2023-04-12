const onboardingList = {
    header: 'Onboarding-Tour',
    title: 'Onboarding',
    buttontext: 'Tour starten',
    skip: 'Überspringen',
    content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod',
    cards: {
        card0: {
            title: 'Onboarding-Tour allgemein',
            content: 'Möchtest du wissen, was unsere Plattform alles zu bieten hat? Wir zeigen dir die wichtigsten Funktionen.',
            url: '/onboarding/students/',
        },
        card1: {
            title: 'Onboarding-Tour 1:1 Matching',
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.',
            url: '/onboarding/helpermatching/',
        },
        card2: {
            title: 'Onboarding-Tour Gruppenkurs',
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.',
            url: '/',
        },
        card3: {
            title: 'Onboarding-Tour Hilfebereich',
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.',
            url: '/',
        },
        card4: {
            title: 'Onboarding-Tour Termine',
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.',
            url: '/',
        },
    },
    Wizard: {
        students: {
            welcome: {
                title: 'Herzlich willkommen bei Lern-Fair',
                content: 'Wir freuen uns, dass du unser Angebot nutzt.',
                question: 'Möchtest du sehen, was unsere Plattform alles zu bieten hat?',
                answer: 'Wir zeigen dir die wichtigsten Funktionen.',
                startTour: 'Tour starten',
                skipTour: 'Tour überspringen',
                popup: {
                    title: 'Bist du sicher, dass du die Tour überspringen möchtest?',
                    content: 'Du kannst die Tour auch jederzeit neu starten. Du findest den Punkt im Hilfebereich unter “Onboarding”.',
                    defaultButtonText: 'Nein, Tour beginnen',
                    outlineButtonText: 'Ja, Tour überspringen',
                },
            },
            matching: {
                title: 'Lernunterstützung',
                content: 'Wenn du Einzel-Hilfe brauchst, dann ist die Lernunterstützung das Richtige für dich. Du bekommst von uns eine:n feste:n Helfer:in.',
            },
            groupCourse: {
                title: 'Nachhilfe-Kurse',
                content: 'In kleinen Gruppen gibt es Hilfe zu verschiedenen Themen.',
            },
            appointments: {
                title: 'Meine Termine',
                content: 'Hier findest du eine Übersicht deiner geplanten Termine.',
            },
            helpCenter: {
                title: 'Hilfebereich',
                content: 'Hier findest du häufig gestellte Fragen mit ihren Antworten. Außerdem kannst du uns hier kontaktieren',
            },
            profile: {
                title: 'Profil',
                content: 'In deinem Profil kannst du die Fächer, in denen du Hilfe brauchst, ändern.',
            },
            settings: {
                title: 'Einstellungen',
                content:
                    'In diesem Bereich kannst du allgemeine Änderungen und Änderungen zu deinem Konto (E-Mail-Adresse, Passwort) vornhemen. Zudem findet du hier auch rechliche Hinweise zur Nutzung der Plattform.',
            },
            notification: {
                title: 'Benachrichtigung',
                content:
                    'Du wirst über Neuigkeiten zu deinem Matching, neue Kontaktaufnahmen, allgemeine Themen informiert. Über die Glocke oben rechts siehtst du, ob du neue Nachrichten hast.',
            },
            finisher: {
                title: 'Fertig!',
                content: 'Einen Moment, dein persönliches Dashboard wird geladen.',
                button: 'zum Dashboard',
            },
        },
        helper: {
            welcome: {
                title: 'Herzlich Willkommen bei Lern-Fair',
                content: 'Wir freuen uns, dass du bildungs-benachteiligte Kinder aktiv unterstützen möchtest.',
                question: 'Möchtest du sehen, was unsere Plattform alles zu bieten hat?',
                answer: 'Wir zeigen dir die wichtigsten Funktionen.',
                startTour: 'Tour starten',
                skipTour: 'Tour überspringen',
                popup: {
                    title: 'Bist du sicher, dass du die Tour überspringen möchtest?',
                    content: 'Du kannst die Tour auch jederzeit neu starten. Du findest den Punkt unter deinen Einstellungen als Punkt „Onboarding-Tour“.',
                    defaultButtonText: 'Nein, Tour beginnen',
                    outlineButtonText: 'Ja, Tour überspringen',
                },
            },
            matching: {
                title: 'Lernunterstützung',
                content:
                    'Die Lernunterstützung ist eine 1:1-Betreuung für Schüler:innen, die individuelle Hilfe benötigen. Unter diesem Punkt findest du deine Termine, deine Lernparter:innen, siehst deine angefragten Matches und kannst neue Matches anfordern.',
            },
            groupCourse: {
                title: 'Gruppen-Kurse',
                content:
                    'Gruppen-Kurse bieten eine kurzfristige Unterstützung bei spezifischen Problemen und Fragen. Unter „Meine Kurse“ werden alle deine Gruppen-Kurse angezeigt. Hier hast du auch die Möglichkeit, neue Kurse zu erstellen.',
            },
            appointment: {
                title: 'Termine',
                content: 'Unter „Meine Termine“ werden dir all deine Termine, angeordnet in Tabs und sortiert nach Datum, angezeigt.',
            },
            helpCenter: {
                title: 'Hilfebereich',
                content: 'Solltest du Hilfe benötigen, findest du die wichtigsten Informationen in unserem Hilfebereich.',
            },
            profile: {
                title: 'Profil',
                content: 'In deinem Profil kannst du alles relevanten Daten eingeben.',
            },
            settings: {
                title: 'Einstellungen',
                content:
                    'In diesem Bereich kannst du allgemeine Änderungen und Änderungen zu deinem Konto (E-Mail-Adresse, Passwort) vornhemen. Zudem findet du hier auch rechliche Hinweise zur Nutzung der Plattform.',
            },
            notification: {
                title: 'Benachrichtigung',
                content:
                    'Du wirst über Neuigkeiten zu deinem Matching, neue Kontaktaufnahmen, allgemeine Themen informiert. Über die Glocke oben rechts siehtst du, ob du neue Nachrichten hast.',
            },
            finisher: {
                title: 'Fertig!',
                content: 'Einen Moment, dein persönliches Dashboard wird geladen.',
                button: 'zum Dashboard',
            },
        },
        helperMatching: {
            welcome: {
                title: 'Onboarding-Tour Lernunterstützung',
                content: 'Wir zeigen dir hier alle wichtigen Informationen, die du über die Lernunterstützung wissen musst.',
                question:
                    'Wie fordere ich eine:n Lernpartner:in an? Wie nehme ich Kontakt mit meinem:r Lernpartner:in auf? Wie kann ich ein Lernpaar auflösen?',
                answer: 'Wir zeigen dir die wichtigsten Funktionen.',
                startTour: 'Tour starten',
                skipTour: 'Tour überspringen',
                popup: {
                    title: 'Bist du sicher, dass du die Tour überspringen möchtest?',
                    content: 'Du kannst die Tour auch jederzeit neu starten. Du findest den Punkt unter deinen Einstellungen als Punkt „Onboarding-Tour“.',
                    defaultButtonText: 'Nein, Tour beginnen',
                    outlineButtonText: 'Ja, Tour überspringen',
                },
            },
            matching: {
                title: 'Lernpartner:in anfordern',
                content:
                    'Über den Button “Lernpartner:in” anfordern auf dem Dashboard oder im Bereich Einzel kannst du eine:n neue:n Lernpartner:in anfordern.',
            },
            request: {
                title: 'Anfrage stellen',
                content: 'Damit wir dir eine:n Lernpartner:in zuteilen können, benötigen wir ein paar Informationen über dich und dein Angebot.',
            },
            match: {
                title: 'Zuteilung des Lernpaars',
                content: 'Nachdem du deine Anfrage gestellt hast, begeben wir uns auf die Suche nach einem/einer passenden Lernpartner:in für dich.',
                contentsec:
                    'Du kannst deine Anfrage auch jederzeit zurücknehmen. Unter dem Punkt Anfragen im Bereich Einzel sind alle deine Anfragen aufgeführt.',
            },
            contact: {
                title: 'Kontaktaufnahme',
                content:
                    'Wurdest du gematcht kannst du deine:n Lernpartner:in direkt über den Button „Kontakt aufnehmen“ in der Benachrichtigung kontaktieren.',
                contentsec:
                    'Möchtest du deine:n Lernpartner:in zu einen späteren Zeitpunkt kontaktieren, kannst du dies auch über das Profil deines/deiner Lernpartners/Lernpartnerin tun.',
            },
            matchSolve: {
                title: 'Lernpaar auflösen',
                content:
                    'Wenn du die Lernpartnerschaft mit einem:r Lernpartner:in auflösen möchtest, kannst du dies unter dem Punkt Einzel unter “Lernpartner:innen” über den Button “Lernpaar auflösen” tun.',
            },
            finisher: {
                title: 'Geschafft',
                firstContent: 'Glückwunsch, du hast die Onboarding-Tour zur Lernunterstützung abgeschlossen.',
                headlineContent: 'Hast du alles verstanden?',
                answer: 'Du kannst dir die Tour nochmal ansehen und in unserem Hilfebereich vorbeischauen. Hier findest du die wichtigsten Informationen und Hilfestellungen für dich als Helfer:in.',
                linkText: 'Zum Hilfebereich',
                helpcenter: 'Zum Hilfebereich',
                buttonText: 'Tour beenden',
                buttonLinkText: 'Tour nochmal ansehen',
            },
        },
    },
};
export default onboardingList;
