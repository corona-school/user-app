const lernfair = {
    languages: {
        albanisch: 'Albanisch',
        arabisch: 'Arabisch',
        armenisch: 'Armenisch',
        aserbaidschanisch: 'Aserbaidschanisch',
        bosnisch: 'Bosnisch',
        bulgarisch: 'Bulgarisch',
        chinesisch: 'Chinesisch',
        deutsch: 'Deutsch',
        englisch: 'Englisch',
        franz_sisch: 'Französisch',
        französisch: 'Französisch',
        italienisch: 'Italienisch',
        kasachisch: 'Kasachisch',
        kurdisch: 'Kurdisch',
        polnisch: 'Polnisch',
        portugiesisch: 'Portugiesisch',
        russisch: 'Russisch',
        spanisch: 'Spanisch',
        // t_rkisch: 'Türkisch',
        ukrainisch: 'Ukrainisch',
        vietnamesisch: 'Vietnamesisch',
        other: 'Andere',
        andere: 'Andere',
    },
    subjects: {
        Altgriechisch: 'Altgriechisch',
        Biologie: 'Biologie',
        Chemie: 'Chemie',
        Chinesisch: 'Chinesisch',
        Deutsch: 'Deutsch',
        'Deutsch als Zweitsprache': 'Deutsch als Zweitsprache',
        Englisch: 'Englisch',
        Erdkunde: 'Erdkunde',
        Französisch: 'Französisch',
        Geschichte: 'Geschichte',
        Informatik: 'Informatik',
        Italienisch: 'Italienisch',
        Kunst: 'Kunst',
        Latein: 'Latein',
        Mathematik: 'Mathematik',
        Musik: 'Musik',
        Niederländisch: 'Niederländisch',
        Pädagogik: 'Pädagogik',
        Philosophie: 'Philosophie',
        Physik: 'Physik',
        Politik: 'Politik',
        Religion: 'Religion',
        Russisch: 'Russisch',
        Sachkunde: 'Sachkunde',
        Spanisch: 'Spanisch',
        Wirtschaft: 'Wirtschaft',
    },
    states: {
        bw: 'Baden-Württemberg',
        by: 'Bayern',
        be: 'Berlin',
        bb: 'Brandenburg',
        hb: 'Bremen',
        hh: 'Hamburg',
        he: 'Hessen',
        mv: 'Mecklenburg-Vorpommern',
        ni: 'Niedersachsen',
        nw: 'Nordrhein-Westfalen',
        rp: 'Rheinland-Pfalz',
        sl: 'Saarland',
        sn: 'Sachsen',
        st: 'Sachsen-Anhalt',
        sh: 'Schleswig-Holstein',
        th: 'Thüringen',
        other: 'Andere',
    },
    schooltypes: {
        grundschule: 'Grundschule',
        hauptschule: 'Hauptschule',
        realschule: 'Realschule',
        gymnasium: 'Gymnasium',
        gesamtschule: 'Gesamtschule',
        other: 'Andere',
        berufsschule: 'Berufsschule',
        f_rderschule: 'Förderschule',
    },
    schoolclass: '{{class}}. Klasse',

    reason: {
        course: {
            // from backend/graphql/student/fields.ts
            instructor: {
                'not-instructor': 'Du bist noch nicht als Kursleiter:in registriert.',
                'not-screened': 'Du bist noch nicht als Kursleiter:in freigeschaltet. Bitte führe zuerst dein Kennenlerngespräch mit uns.',
            },
            // from backend/common/courses/participants.ts
            pupil: {
                'subcourse-full': 'Dieser Kurs ist leider gerade ausgebucht.',
                'grade-to-high': 'Du kannst dich nicht anmelden, weil deine Klassenstufe zu groß ist.',
                'grade-to-low': 'Du kannst dich nicht anmelden, weil deine Klassenstufe zu klein ist.',
                'no-lectures': 'Du kannst dich nicht anmelden, da keine Lektionen angelegt sind.',
                'already-started': 'Du kannst dich nicht anmelden, da der Kurs bereits gestartet hat.',
                'not-participant': 'Du kannst dich nicht anmelden, weil du nicht für Gruppen-Kurse registriert bist. Bitte wende dich an den Support.',
            },
        },
        // from backend/commmon/match/requests.ts
        matching: {
            tutor: {
                'not-screened': 'Du kannst noch kein Lernpaar bilden. Bitte führe zuerst dein Kennenlerngespräch mit uns.',
                'not-tutor': 'Du kannst kein Lernpaar bilden, da du nicht für die Lernunterstützung registriert bist.',
                'max-requests': 'Du hast die maximale Zahl an erlaubten Anfragen erreichst und kannst daher keine weitere stellen.',
            },
            pupil: {
                'max-dissolved-matches': 'Du kannst kein Lernpaar anfordern, weil du bereits zu viele Lernpaare hattest.',
                'not-tutee': 'Du kannst kein Lernpaar anfordern, da du nicht für die Lernunterstützung registriert bist.',
                'max-requests': 'Du bist bereits auf der Warteliste.',
                'max-matches':
                    'Aufgrund der hohen Nachfrage kannst du nur ein:e Lernpartner:in gleichzeitig haben. Solltest du nicht mehr mit deinem:r Lernpartner:in zusammenarbeiten, löse die Verbindung auf.',
                deactivated: 'Aufgrund der hohen Nachfrage können aktuell leider keine neuen Anfragen für Lernpartner:innen angenommen werden.',
            },
        },
    },
};

export default lernfair;
// Subject[]
