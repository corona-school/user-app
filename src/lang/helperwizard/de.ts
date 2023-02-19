const helperwizard = {
    nextStep: 'Deine nächsten Schritte',
    // Schüler:innen und Helfer:innen
    verifizierung: {
        title: 'Verifiziere deine E-Mail-Adresse',
        content:
            '“Bevor du bei Lern-Fair starten kanst, musst du zunächst deine E-Mail-Adresse bestätigen. Wir haben dir dazu am {{date}} eine E-Mail an {{email}} gesendet. Du hast keine E-Mail von uns erhalten?”',
        buttons: ['E-Mail erneut senden'],
    },
    passwort: {
        title: 'Passwort einrichten',
        content:
            'Es ist endlich so weit, wir stellen unser Login-System um! Du kannst ab sofort ein Passwort für deinen Lern-Fair Account vergeben und dich damit zukünftig einloggen.',
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
            'Sobald du an der Reihe bist, werden wir dich per E-mail informieren. Aktuell dauert es leider etwas länger, denn sehr viele Schüler:innen warten auf Unterstützung. Voraussichtlich musst du 3-6 Monate warten. Deine Anfrage wurde am {{date}} gestellt. In der Zwischenzeit kannst du an unserer Gruppen-Nachhilfe teilnehmen.',
        buttons: ['Gruppenkurse ansehen', 'Anfrage zurücknehmen'],
    },
    interestconfirmation: {
        title: 'Brauchst du noch Unterstützung?',
        content:
            'Du bist nun oben auf unserer Warteliste und wir können dich bald mit einem:r Lernpartner:in verbinden. Brauchst du immer noch Hilfe in den Fächern {{subjectSchüler}}. Wenn du “Nein” klickst oder dich nicht innerhalb von 14 Tagen bei uns meldest, vergeben wir deinen Platz an andere Schüler:innen.',
        buttons: ['Ja', 'Nein'],
    },
    kontaktSchüler: {
        title: 'Neue Lernpartner:in',
        content:
            'Es ist endlich so weit, wir haben eine:n Lernpartner:in für dich gefunden! {{nameHelfer}} kann dich ab sofort in {{subjectHelfer}} unterstützen. Bitte nehme Kontakt mit {{nameHelfer}} auf und vereinbare ein erstes Treffen. ',
        buttons: ['Kontakt aufnehmen', 'Lernpartner:in ansehen'],
    },
    angeforderteBescheinigung: {
        title: '{{nameHelfer}} braucht eine Bestätigung von dir',
        content:
            '{{nameHelfer}} hat uns um eine Bescheinigung für eure Lernunterstützung gebeten. Nur wenn du dies bestätigst, können wir {{nameHelfer}} diesen Wunsch erfüllen.',
        buttons: ['Angaben bestätigen'],
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
            'Wie im Kennenlerngespräch erläutert, brauchen wir von dir ein erweitertes Führungszeugnis, welches du unter Vorlage des Vordrucks kostenlos vor Ort oder online beantragen kannst. Du kannst dennoch sofort mit deinem Engagement bei uns beginnen und Schüler:innen unterstützen. Frist für die Einreichung: {{cocDate}}',
        buttons: ['Führungszeugnis einreichen', 'Vorduck herunterladen'],
    },
    statusStudent: {
        title: 'Jemand wartet auf dich!',
        content:
            'Danke, dass du eine:n Schüler:in bei Lern-Fair unterstützen möchtest! Wir werden dir jemanden vermitteln, der:die zu den von dir angegebenen Fächern bzw. Jahrgangsstufen passt. In der Regel melden wir uns bei dir per E-Mail innerhalb einer Woche mit einem:r passenden Schüler:in. Wenn du Lust und Zeit hast, mehrere Schüler:innen zu unterstützen, kannst du jederzeit eine weitere Lernpartnerschaft anfragen. Wenn du hin und wieder Kleingruppen unterrichten möchtest, kannst du einen einmaligen oder fortlaufenden Gruppenkurs anbieten.',
        buttons: ['Problem melden'],
    },
    kontaktStudent: {
        title: 'Neue Lernpartner:in',
        content:
            'Es ist soweit, wir haben eine:n Schüler:in für dich gefunden! {{nameSchüler}} freut sich schon sehr auf deine Unterstützung. Bitte nehme Kontakt mit {{nameSchüler}} auf und vereinbare ein erstes Treffen.',
        buttons: ['Kontakt aufnehmen', 'Lernpartner:in ansehen'],
    },
};
export default helperwizard;
