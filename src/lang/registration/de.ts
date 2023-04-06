const registration = {
    password_repeat: 'Passwort wiederholen',
    to_login: 'Ich habe bereits einen Account',
    dsgvo: {
        accept: 'Hiermit stimme ich der',
        datapolicy: 'Datenschutzerklärung',
        lastword: 'zu.',
        pleaseaccept: 'Bitte akzeptiere unsere',
    },
    barrier: {
        title: 'Wichtig',
        text: 'Unsere Angebote richten sich an bildungsbenachteiligte Schüler:innen. Du weißt nicht genau ob die zu dieser Zielgruppe gehörst?\n\nDann schaue dir die nachfolgenden Punkte an. Kannst du zwei oder mehr von ihnen mit "ja" beantworten? Dann darfst du gerne alle Angebote von Lern-Fair nutzen.',
        point_0: '● Du brauchst Hilfe in der Schule',
        point_1: '● Deine Familie kann dir nicht bei deinen Hausaufgaben helfen',
        point_2: '● Deine Familie kann keine Nachhilfe für dich bezahlen',
        btn: {
            yes: 'Ja, die Punkte treffen zu',
            no: 'Nein, die Punkte treffen nicht zu',
        },
    },
    hint: {
        name: 'Bitte gebe deinen vollen Namen an',
        password: {
            length: 'Das Passwort muss mindestens 6 Zeichen enthalten.',
            nomatch: 'Die Passwörter stimmen nicht überein',
        },
        email: {
            invalid: 'Ungültige E-Mail-Adresse',
            unavailable: 'Diese E-Mail-Adresse ist bereits vergeben',
        },
        userType: {
            missing: 'Bitte identifiziere deine Rolle',
        },
    },
    personal: {
        title: 'Gib deine persönlichen Daten ein',
        about: {
            label: 'Über mich',
            text: 'Schreib hier einen kurzen Text zu dir, den andere Nutzer:innen auf deinem Profil sehen können.',
        },
    },
    result: {
        success: {
            title: 'Erledigt!',
            text: 'Dein Account wurde erfolgreich erstellt. Du kannst nun das Angebot von Lern-Fair nutzen!',
            btn: 'Zur Anwendung',
        },
        error: {
            tryagain: 'Erneut versuchen',
            message: {
                'Email is already used by another account': 'Diese Email ist bereits in Verwendung',
                'Response not successful: Received status code 400': 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
                'RateLimit Enforcement': 'Du hast zu viele Anfragen gestellt. Bitte versuche es später erneut.',
                'Unknown User Type': 'Dein Account-Typ konnte nicht bestimmt werden. Bitte versuche versuche einen einfachen Login.',
            },
        },
    },
    steps: {
        '0': {
            title: 'Deine Rolle',
            subtitle: 'Ich bin',
        },
        '1': {
            title: 'Persönliche Daten',
            subtitle: 'Persönliche Daten',
        },
        '2': {
            title: 'Klasse',
            subtitle: 'In welcher Klasse bist du?',
        },
        '3': {
            title: 'Schulform',
            subtitle: 'Auf welche Schulform gehst du?',
        },
        '4': {
            title: 'Bundesland',
            subtitle: 'Aus welchem Bundesland kommst du?',
        },
        '5': {
            title: 'Einwilligungen',
            subtitle: 'Einwilligungen',
        },
    },

    pupil: { label: 'Schüler:in' },
    student: {
        label: 'Helfer:in',
    },
    verifyemail: {
        title: 'Überprüfe dein E-Mail-Postfach!',
        mailsendto: 'Wir haben eine E-Mail an {{email}} gesendet.',
        description:
            'Bevor du unser Angebot nutzen kannst, musst du deine E-Mail-Adresse bestätigen. Danach wirst du automatisch in deinen User-Bereich weitergeleitet.',
        notreceived: 'Keine E-Mail erhalten? Schau bitte auch im Spam nach!',
        resend: {
            button: 'Bestätigungsmail erneut senden',
            successAlert: 'Wir haben dir die Bestätigungs-E-Mail erneut gesendet. Bitte überprüfe deinen Posteingang und schau auch im Spam nach.',
            failedAlert: 'Leider ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
        },
        backToWelcomeButton: 'Zum Login-Bereich',
    },
};

export default registration;
