export type SchoolType = {
    key: string;
    label: string;
};

export const schooltypes: SchoolType[] = [
    { label: 'Grundschule', key: 'grundschule' },
    { label: 'Hauptschule', key: 'hauptschule' },
    { label: 'Gesamtschule', key: 'gesamtschule' },
    { label: 'Realschule', key: 'realschule' },
    { label: 'Gymnasium', key: 'gymnasium' },
    { label: 'Berufsschule', key: 'berufsschule' },
    { label: 'Förderschule', key: 'f_rderschule' },
    { label: 'Mittelschule', key: 'mittelschule' },
    { label: 'Oberschule', key: 'oberschule' },
    { label: 'Sekundarschule', key: 'sekundarschule' },
    { label: 'Stadtteilschule', key: 'stadtteilschule' },
    { label: 'Berufsfachschule (BFS)', key: 'berufsfachschule' },
    { label: 'Fachoberschule (FOS)', key: 'fachoberschule' },
    { label: 'Berufsoberschule (BOS)', key: 'berufsoberschule' },
    { label: 'Oberstufenzentrum (OSZ)', key: 'oberstufenzentrum' },
    { label: 'Fachschule', key: 'fachschule' },
    { label: 'Abendschule / Weiterbildung / VHS', key: 'abendschule_vhs' },
    { label: 'Berufskolleg', key: 'berufskolleg' },
    { label: 'Beruflichesgymnasium', key: 'beruflichesgymnasium' },
    { label: 'Studienkolleg (Hochschule / Uni)', key: 'uni_studienkolleg' },
    { label: 'Ausländische Schule', key: 'auslandsschule' },
    { label: 'Privatschule', key: 'privatschule' },
    { label: 'Sonstige', key: 'other' },
];

export const getSchoolTypeKey: (name: string) => string = (name) => {
    for (let schooltype of schooltypes) {
        if (schooltype.key === name) {
            return schooltype.label;
        }
    }
    return 'other';
};
