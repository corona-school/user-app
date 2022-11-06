const registration = {
  new: 'Neu registrieren',
  register: 'Registrieren',
  password_repeat: 'Passwort wiederholen',
  i_am: 'Ich bin',
  parent: 'Elternteil',
  to_login: 'Ich habe bereits einen Account',
  btn: {
    next: 'Weiter'
  },
  check_legal:
    'Hiermit stimme ich den Nutzungsbedingungen und der Datenschutzerklärung zu.',
  barrier: {
    title: 'Wichtig',
    text: 'Unsere Angebote richten sich an bildungsbenachtiligte Schüler:innen. Du weißt nicht genau ob die zu dieser Zielgruppe gehörst?\n\nDann schaue dir die nachfolgenden Punkte an. Kannst du zwei oder mehr von ihnen mit "ja" beantworten? Dann darfst du gerne alle Angebote von Lern-Fair nutzen.',
    point_0: '● Du brauchst Hilfe in der Schule',
    point_1: '● Deine Familie kann dir nicht bei deinen Hausaufgaben helfen',
    point_2: '● Deine Familie kann keine Nachhilfe für dich bezahlen',
    point_3: 'Sind beide Eltern/ Erziehungsberechtigten nicht erwerbstätig',
    point_4:
      'Sind beide Eltern/ Erziehungsberechtigten physisch oder psychisch (aufgrund einer Krankheit / eines Unfalls etc.) eingeschränkt?',
    point_5:
      'Bist du von einer physischen Krankheit betroffen, die es erschwert zur Schule zu gehen?',
    point_6: 'Bist du oder sind deine Eltern nicht in Deutschland geboren?',
    point_7:
      'Können dir deine Eltern/ Erziehungsberechtigten aufgrund einer sprachlichen Barriere nicht bei den Hausaufgaben helfen?',
    point_8:
      'Können dir deine Eltern/ Erziehungsberechtigten wegen ihres Bildungsweges nicht bei den Hausaufgaben helfen?',
    point_9:
      'Wenn du dir noch immer unsicher bist und noch Fragen hast, dann wende dich bitte an sorgen-eule@lern-fair.de',
    btn: {
      yes: 'Ja, die Punkte treffen zu',
      no: 'Nein, die Punkte treffen nicht zu'
    }
  },
  hint: {
    password: {
      length: 'Das Passwort muss mindestens 6 Zeichen enthalten.',
      nomatch: 'Die Passwörter stimmen nicht überein'
    },
    email: {
      invalid: 'Ungültige Email-Adresse'
    },
    userType: {
      missing: 'Bitte identifiziere deine Rolle'
    }
  },
  personal: {
    title: 'Gib deine persönlichen Daten ein',
    about: {
      label: 'Über mich',
      text: 'Schreib hier einen kurzen Text zu dir, den andere Nutzer:innen auf deinem Profil sehen können.'
    }
  },
  result: {
    success: {
      title: 'Erledigt!',
      text: 'Dein Account wurde erfolgreich erstellt. Du kannst nun das Angebot von Lern-Fair nutzen!',
      btn: 'Zur Anwendung'
    },
    error: {
      btn: 'Zurück',
      message: {
        'Email is already used by another account':
          'Diese Email ist bereits in Verwendung'
      }
    }
  },
  questions: {
    pupil: {
      schooltype: {
        label: 'Schulform',
        question: 'Auf welche Schule gehst du?'
      },
      schoolclass: {
        label: 'Klasse',
        question: 'In welcher Klasse bist du?'
      },
      languages: {
        label: 'Sprache',
        question: 'Welche Sprache(n) sprichst du zu Hause?'
      },
      subjects: {
        label: 'Fächer',
        question: 'In welchen Fächern benötigst du Unterstützung?',
        text: 'Du kannst mehrere Fächer auswählen'
      },
      state: {
        label: 'Bundesland',
        question: 'Aus welchem Bundesland kommst du?'
      },
      deutsch: {
        label: 'Deutsch',
        question: 'Seit wann lernst du Deutsch?'
      },
      deutsch2: {
        lower: 'weniger als 1 Jahr',
        higher: 'mehr als 1 Jahr'
      }
    },
    student: {
      offers: {
        label: 'Unterstützung',
        question: 'Welche Art der Unterstützung möchtest du anbieten?',
        text: 'Eine Mehrfachauswahl ist möglich'
      },
      subjects: {
        label: 'Fächer',
        question: 'In welchen Fächern kannst du unterstützen?',
        text: ''
      }
    }
  },
  pupil: { label: 'Schüler:in' },
  student: {
    label: 'Helfer:in',
    classSelection: {
      btn: 'Speichern',
      title: 'In welchen Klassen kannst du unterstützen?',
      range1: '1. - 4. Klasse',
      range2: '5. - 8. Klasse',
      range3: '9. - 10. Klasse',
      range4: '11. - 13. Klasse'
    }
  }
}

export default registration
