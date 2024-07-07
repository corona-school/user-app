import { Course_Subject_Enum, Subject } from '../gql/graphql';

// Keep in sync with Backend!
export const SUBJECTS = [
    'Altgriechisch',
    'Arbeitslehre',
    'Biologie',
    'Chemie',
    'Chinesisch',
    'Deutsch',
    'Deutsch als Zweitsprache',
    'Englisch',
    'Erdkunde',
    'Ethik',
    'Französisch',
    'Geschichte',
    'Gesundheit',
    'Informatik',
    'Italienisch',
    'Kunst',
    'Latein',
    'Mathematik',
    'Musik',
    'Niederländisch',
    'Pädagogik',
    'Philosophie',
    'Physik',
    'Politik',
    'Religion',
    'Russisch',
    'Sachkunde',
    'Spanisch',
    'Technik',
    'Wirtschaft',
    'Lernen lernen',
] as const;

export type SingleSubject = typeof SUBJECTS[number];

export const SUBJECTS_MAIN: SingleSubject[] = ['Deutsch', 'Deutsch als Zweitsprache', 'Englisch', 'Mathematik'];

export const SUBJECTS_MINOR: SingleSubject[] = ['Französisch', 'Biologie', 'Physik', 'Chemie'];

export const SUBJECTS_RARE: SingleSubject[] = [
    'Erdkunde',
    'Geschichte',
    'Lernen lernen',
    'Wirtschaft',
    'Informatik',
    'Latein',
    'Politik',
    'Sachkunde',
    'Spanisch',
    'Musik',
    'Pädagogik',
    'Arbeitslehre',
    'Ethik',
    'Gesundheit',
    'Technik',
];

// Unfortunately this mapping is necessary as paths need to be ASCII to work reliably in the build setup
export const SUBJECT_TO_ICON: { [subject in SingleSubject]: string } = {
    'Deutsch als Zweitsprache': 'deutsch_als_zweitsprache',
    Deutsch: 'deutsch',
    Altgriechisch: 'altgriechisch',
    Arbeitslehre: 'arbeitslehre',
    Biologie: 'biologie',
    Chemie: 'chemie',
    Chinesisch: 'chinesisch',
    Englisch: 'englisch',
    Erdkunde: 'erdkunde',
    Ethik: 'ethik',
    Französisch: 'franzoesisch',
    Geschichte: 'geschichte',
    Gesundheit: 'gesundheit',
    Informatik: 'informatik',
    Italienisch: 'italienisch',
    Kunst: 'kunst',
    Latein: 'latein',
    Mathematik: 'mathematik',
    Musik: 'musik',
    Niederländisch: 'niederlaendisch',
    Philosophie: 'philosophie',
    Physik: 'physik',
    Politik: 'politik',
    Pädagogik: 'paedagogik',
    Religion: 'religion',
    Russisch: 'russisch',
    Sachkunde: 'sachkunde',
    Spanisch: 'spanisch',
    Technik: 'technik',
    Wirtschaft: 'wirtschaft',
    'Lernen lernen': 'lernen_lernen',
};

// Unfortunately this mapping is necessary as our two ORMs have problems with non ASCII chars:
export const SUBJECT_TO_COURSE_SUBJECT: { [subject in SingleSubject]: Course_Subject_Enum } = {
    'Deutsch als Zweitsprache': Course_Subject_Enum.DeutschAlsZweitsprache,
    Deutsch: Course_Subject_Enum.Deutsch,
    Altgriechisch: Course_Subject_Enum.Altgriechisch,
    Arbeitslehre: Course_Subject_Enum.Arbeitslehre,
    Biologie: Course_Subject_Enum.Biologie,
    Chemie: Course_Subject_Enum.Chemie,
    Chinesisch: Course_Subject_Enum.Altgriechisch,
    Englisch: Course_Subject_Enum.Englisch,
    Erdkunde: Course_Subject_Enum.Erdkunde,
    Ethik: Course_Subject_Enum.Ethik,
    Französisch: Course_Subject_Enum.FranzSisch,
    Gesundheit: Course_Subject_Enum.Gesundheit,
    Geschichte: Course_Subject_Enum.Geschichte,
    Informatik: Course_Subject_Enum.Informatik,
    Italienisch: Course_Subject_Enum.Italienisch,
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
    Technik: Course_Subject_Enum.Technik,
    Wirtschaft: Course_Subject_Enum.Wirtschaft,
    'Lernen lernen': Course_Subject_Enum.LernenLernen, // TODO
};

export const DAZ = 'Deutsch als Zweitsprache';

export const containsDAZ = (subjects: Subject[]) => subjects.some((it) => it.name === DAZ);
