const helperwizard = {
    nextStep: 'Die nächsten Schritte',
    // Schüler:innnen und Helfer:innen
    verifizierung: {
        title: 'Verifiziere deine E-Mail-Adresse',
        content:
            '“Bevor du bei Lern-Fair starten kanst, musst du zunächst deine E-Mail-Adresse bestätigen. Wir haben dir dazu am dd.mm.yyyy eine E-Mail an xxx@mail.de gesendet. Du hast keine E-Mail von uns erhalten?”',
        buttons: ['E-Mail erneut senden'],
    },
    passwort: {
        title: 'Passwort einrichten',
        content:
            'Wie im Kennenlerngespräch erläutert, brauchen wir von dir ein erweitertes Führungszeugnis, welches du unter Vorlage des Vordrucks kostenlos vor Ort oder online beantragen kannst. Du kannst dennoch sofort mit deinem Engagement bei uns beginnen und Schüler:innen unterstützen. Frist für die Einreichung',
        buttons: ['Passwort einrichten'],
    },
    // Nur Schüler:innen
    willkommen: {
        title: 'Willkommen bei Lern-Fair 👋',
        content:
            'Wir freuen uns, dich bei Lern-Fair begrüßen zu dürfen! Wir bieten dir in unserer Gruppen-Nachhilfe viele Kurse zu verschiedenen Themen aus Deutsch, Mathe und Englisch. Wenn du individuelle Hilfe brauchst, kannst du dich auch auf die Warteliste für unsere 1:1-Lernunterstützung setzen',
        buttons: ['Kurse ansehen', '1:1-Lernunterstützung beantragen'],
    },
    statusSchüler: {
        title: 'Du bist auf der Warteliste!',
        content:
            'Sobald du an der Reihe bist, werden wir dich per E-mail informieren. Aktuell dauert es leider etwas länger, denn sehr viele Schüler:innen warten auf Unterstützung. Voraussichtlich musst du 3-6 Monate warten. Deine Anfrage wurde am dd.mm.yyyy gestellt. In der Zwischenzeit kannst du an unserer Gruppen-Nachhilfe teilnehmen.',
        buttons: ['Gruppenkurse ansehen', 'Anfrage zurücknehmen'],
    },
    interestconformation: {
        title: 'Brauchst du noch Unterstützung?',
        content:
            'Du bist nun oben auf unserer Warteliste und wir können dich bald mit einem:r Lernpartner:in verbinden. Brauchst du immer noch Hilfe in den Fächern SUBECTS SCHÜLER:IN? Wenn du “Nein” klickst oder dich nicht innerhalb von 14 Tagen bei uns meldest, vergeben wir deinen Platz an andere Schüler:innen.',
        buttons: ['Ja', 'Nein'],
    },
    kontaktSchüler: {
        title: 'Neue Lernpartner:in',
        content:
            'Es ist endlich soweit, wir haben eine:n Lernpartner:in für dich gefunden! NAME HELFER:IN kann dich ab sofort in SUBJECTS HELFER:IN unterstützen. Bitte nehme Kontakt mit NAME HELFER:IN auf und vereinbare ein erstes Treffen. ',
        buttons: ['Kontakt aufnehmen', 'Lernpartner:in ansehen'],
    },
    angeforderteBescheinigung: {
        title: 'HELFER:IN NAME braucht eine Bestätigung von dir',
        content:
            'HELFER:IN NAME hat uns um eine Bescheinigung für eure Lernunterstützung gebeten. Nur wenn du auf “Ja” klickst, können wir HELFER:IN NAME diesen Wunsch erfüllen. Ist es richtig, dass ihr schon so lange zusammen lernt? \nStart: dd.mm.yyyy \nEnde: dd.mm.yyyy \nAnzahl Stunden pro Woche: nh',
        buttons: ['Ja, Angaben bestätigen', 'Nein, Problem melden'],
    },

    // Nur Helfer:innen
    kennenlernen: {
        title: 'Wir möchten dich kennenlernen 👋!',
        content:
            'Bevor du bei uns anfangen kannst, möchten wir dich in einem ca. 15-minütigen Videokonferenzgespräch kennenlernen. Vereinbare einfach einen Termin mit uns.',
        buttons: ['Termin vereinbaren'],
    },
    zeugnis: {
        title: 'Erweitertes Führungszeugnis',
        content:
            'Wie im Kennenlerngespräch erläutert, brauchen wir von dir ein erweitertes Führungszeugnis, welches du unter Vorlage des Vordrucks kostenlos vor Ort oder online beantragen kannst. Du kannst dennoch sofort mit deinem Engagement bei uns beginnen und Schüler:innen unterstützen. Frist für die Einreichung:',
        buttons: ['Führungszeugnis einreichen', 'Vorduck herunterladen'],
    },
    statusStudent: {
        title: 'Wir sind auf der Suche für dich!',
        content:
            'Danke, dass du eine Schüler:in bei Lern-Fair unterstützen möchest! Wir suchen derzeit ein:e Schüler:in in den von dir angegebenen Fächern bzw. Jahrgangsstufen für dich. In der Regel melden wir uns bei dir per E-Mail innerhalb einer Woche mit einem:r passendenden Schüler:in zurück. Wenn du Lust hast mehrere Schüler:innen zu unterstützen, kannst du jederzeit eine weitere Lernpatenschaft anfragen.',
        buttons: ['Problem melden'],
    },
    kontaktStudent: {
        title: 'Neue Lernpartner:in',
        content:
            'Es ist soweit, wir haben eine:n Schüler:in für dich gefunden! NAME SCHÜLER:IN freut sich schon sehr auf deine Unterstützung. Bitte nehme Kontakt mit NAME SCHÜLER:IN auf und vereinbare ein erstes Treffen.',
        buttons: ['Kontakt aufnehmen', 'Lernpartner:in ansehen'],
    },
};
export default helperwizard;
