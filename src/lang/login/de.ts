const login = {
    title: 'Anmeldung',
    error: 'Deine Login-Daten stimmen nicht mit unseren Informationen überein. Bitte überprüfe deine Angaben',
    forgotPassword: 'Passwort vergessen?',
    signupNew: 'Neu registrieren',
    noaccount: 'Du hast noch keinen Account?',
    email: {
        sent: 'Wir haben dir eine E-Mail zum Login geschickt',
    },
    passwordReset: {
        btn: 'Passwort zurücksetzen',
        description: 'Möchtest du dein Passwort wirklich zurücksetzen? Dazu senden wir eine E-Mail an {{email}}',
        alert: {
            success:
                'Wir haben dir eine E-Mail gesendet, in der du dein Passwort zurücksetzen kannst. Klicke dazu auf den Link in unserer E-Mail. Solltest du keine E-Mail erhalten habe, warte bitte einen Moment und schau auch im Spamordner nach.',
            error: 'Leider konnte dein Passwort nicht zurückgesetzt werden. Bitte versuche es später nochmal.',
            mailNotFound:
                'Für diese E-Mail-Adresse ist kein Account registriert. Wenn du denkst, dass das ein Fehler ist, melde dich bitte beim Support (support@lern-fair.de).',
        },
    },
    accountNotFound: {
        title: 'Anmeldung fehlgeschlagen',
        alert_html:
            'Es konnte kein Account mit der E-Mail-Adresse {{email}} gefunden werden. Bitte kontrolliere die eingegebene E-Mail-Adresse und versuche es erneut.',
    },
};

export default login;
