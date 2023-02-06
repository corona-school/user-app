import { Course_Subject_Enum, Subject } from "../gql/graphql";

// Keep in sync with Backend!
export const SUBJECTS = [
    "Altgriechisch",
    "Biologie",
    "Chemie",
    "Chinesisch",
    "Deutsch",
    "Deutsch als Zweitsprache",
    "Englisch",
    "Erdkunde",
    "Französisch",
    "Geschichte",
    "Informatik",
    "Italienisch",
    "Kunst",
    "Latein",
    "Mathematik",
    "Musik",
    "Niederländisch",
    "Pädagogik",
    "Philosophie",
    "Physik",
    "Politik",
    "Religion",
    "Russisch",
    "Sachkunde",
    "Spanisch",
    "Wirtschaft"
] as const;

// Unfortunately this mapping is necessary as paths need to be ASCII to work reliably in the build setup
export const SUBJECT_TO_ICON: { [subject in (typeof SUBJECTS)[number]]: string } = {
    "Deutsch als Zweitsprache": "deutsch_als_zweitsprace",
    Deutsch: "deutsch",
    Altgriechisch: "altgriechisch",
    Biologie: "biologie",
    Chemie: "chemie",
    Chinesisch: "chinesisch",
    Englisch: "englisch",
    Erdkunde: "erdkunde",
    Französisch: "franzoesisch",
    Geschichte: "geschichte",
    Informatik: "informatik",
    Italienisch: "italienisch",
    Kunst: "kunst",
    Latein: "latein",
    Mathematik: "mathematik",
    Musik: "musik",
    Niederländisch: "niederlaendisch",
    Philosophie: "philosophie",
    Physik: "physik",
    Politik: "politik",
    Pädagogik: "paedagogik",
    Religion: "religion",
    Russisch: "russisch",
    Sachkunde: "sachkunde",
    Spanisch: "spanisch",
    Wirtschaft: "wirtschaft"
}

// Unfortunately this mapping is necessary as our two ORMs have problems with non ASCII chars:
export const SUBJECT_TO_COURSE_SUBJECT: { [subject in (typeof SUBJECTS)[number]]: Course_Subject_Enum } = {
    "Deutsch als Zweitsprache": Course_Subject_Enum.DeutschAlsZweitsprache,
    Deutsch: Course_Subject_Enum.Deutsch,
    Altgriechisch: Course_Subject_Enum.Altgriechisch,
    Biologie: Course_Subject_Enum.Biologie,
    Chemie: Course_Subject_Enum.Chemie,
    Chinesisch: Course_Subject_Enum.Altgriechisch,
    Englisch: Course_Subject_Enum.Englisch,
    Erdkunde: Course_Subject_Enum.Erdkunde,
    Französisch: Course_Subject_Enum.FranzSisch,
    Geschichte: Course_Subject_Enum.Geschichte,
    Informatik: Course_Subject_Enum.Informatik,
    Italienisch: Course_Subject_Enum.Informatik,
    Kunst: Course_Subject_Enum.Kunst,
    Latein: Course_Subject_Enum.Latein,
    Mathematik: Course_Subject_Enum.Mathematik,
    Musik: Course_Subject_Enum.Musik,
    Niederländisch: Course_Subject_Enum.NiederlNdisch,
    Philosophie: Course_Subject_Enum.Philosophie,
    Physik: Course_Subject_Enum.Physik,
    Politik: Course_Subject_Enum.Politik,
    Pädagogik: Course_Subject_Enum.PDagogik,
    Religion: Course_Subject_Enum.Religion,
    Russisch: Course_Subject_Enum.Russisch,
    Sachkunde: Course_Subject_Enum.Sachkunde,
    Spanisch: Course_Subject_Enum.Spanisch,
    Wirtschaft: Course_Subject_Enum.Wirtschaft
}

export const DAZ = "Deutsch als Zweitsprache";

export const containsDAZ = (subjects: Subject[]) => subjects.some(it => it.name === DAZ);
