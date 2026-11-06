import { SchoolType } from '@/gql/graphql';
import { EnumSelector, SelectorProps } from './EnumSelector';
import { IconLoader } from './IconLoader';

export const getSchoolTypesForGrade = (grade: number): SchoolType[] => {
    switch (grade) {
        case 1:
        case 2:
        case 3:
        case 4:
            return [SchoolType.Grundschule, SchoolType.FRderschule, SchoolType.Privatschule, SchoolType.Auslandsschule, SchoolType.Other];
        case 5:
        case 6:
            return [
                SchoolType.Grundschule,
                SchoolType.Gymnasium,
                SchoolType.Hauptschule,
                SchoolType.Gesamtschule,
                SchoolType.Realschule,
                SchoolType.FRderschule,
                SchoolType.Mittelschule,
                SchoolType.Oberschule,
                SchoolType.Sekundarschule,
                SchoolType.Stadtteilschule,
                SchoolType.Privatschule,
                SchoolType.Auslandsschule,
                SchoolType.Other,
            ];
        case 7:
        case 8:
        case 9:
            return [
                SchoolType.Gymnasium,
                SchoolType.Hauptschule,
                SchoolType.Gesamtschule,
                SchoolType.Realschule,
                SchoolType.FRderschule,
                SchoolType.Mittelschule,
                SchoolType.Oberschule,
                SchoolType.Sekundarschule,
                SchoolType.Stadtteilschule,
                SchoolType.Privatschule,
                SchoolType.Auslandsschule,
                SchoolType.Other,
            ];
        case 10:
            return [
                SchoolType.Gymnasium,
                SchoolType.Hauptschule,
                SchoolType.Gesamtschule,
                SchoolType.Realschule,
                SchoolType.FRderschule,
                SchoolType.Mittelschule,
                SchoolType.Oberschule,
                SchoolType.Sekundarschule,
                SchoolType.Stadtteilschule,
                SchoolType.Berufsfachschule,
                SchoolType.Privatschule,
                SchoolType.Auslandsschule,
                SchoolType.Other,
            ];
        case 11:
            return [
                SchoolType.Gymnasium,
                SchoolType.Gesamtschule,
                SchoolType.FRderschule,
                SchoolType.Stadtteilschule,
                SchoolType.Berufsfachschule,
                SchoolType.Fachoberschule,
                SchoolType.Berufskolleg,
                SchoolType.Oberstufenzentrum,
                SchoolType.Beruflichesgymnasium,
                SchoolType.Privatschule,
                SchoolType.Auslandsschule,
                SchoolType.Other,
            ];
        case 12:
        case 13:
            return [
                SchoolType.Gymnasium,
                SchoolType.Gesamtschule,
                SchoolType.FRderschule,
                SchoolType.Stadtteilschule,
                SchoolType.Berufsfachschule,
                SchoolType.Fachoberschule,
                SchoolType.Berufsoberschule,
                SchoolType.Berufskolleg,
                SchoolType.Oberstufenzentrum,
                SchoolType.Beruflichesgymnasium,
                SchoolType.Privatschule,
                SchoolType.Auslandsschule,
                SchoolType.Other,
            ];
        case 14:
            return [
                SchoolType.Berufsschule,
                SchoolType.Berufsfachschule,
                SchoolType.Fachoberschule,
                SchoolType.Berufsoberschule,
                SchoolType.Fachschule,
                SchoolType.AbendschuleVhs,
                SchoolType.UniStudienkolleg,
                SchoolType.Oberstufenzentrum,
                SchoolType.Oberstufenzentrum,
                SchoolType.Auslandsschule,
                SchoolType.Other,
            ];
        default:
            return [];
    }
};

export const schoolTypeSearchStrings: Record<SchoolType, string[]> = {
    grundschule: ['grundschule'],
    berufsschule: ['berufsschule'],
    mittelschule: ['mittelschule', 'mittelstufenschule'],
    sekundarschule: ['sekundarschule'],
    stadtteilschule: ['stadtteilschule'],
    berufsfachschule: ['berufsfachschule', 'bfs'],
    fachoberschule: ['fachoberschule', 'fos'],
    berufsoberschule: ['berufsoberschule', 'bos'],
    oberstufenzentrum: ['oberstufenzentrum'],
    abendschule_vhs: ['abendschule', 'vhs', 'fernstudium', 'abendgymnasium', 'weiterbildungskolleg'],
    berufskolleg: ['berufskolleg'],
    oberschule: ['oberschule'],
    f_rderschule: ['förderschule'],
    beruflichesgymnasium: ['beruflichesgymnasium', 'fachgymnasium'],
    uni_studienkolleg: ['studienkolleg', 'universität'],
    fachschule: ['fachschule'],
    hauptschule: ['hauptschule'],
    gesamtschule: ['gesamtschule', 'integrierte sekundarschule'],
    realschule: ['realschule'],
    gymnasium: ['gymnasium'],
    auslandsschule: [],
    privatschule: ['montessori', 'waldorf', 'privatschule', 'ersatzschule'],
    other: [],
};

export const _SchoolTypeSelector = EnumSelector(
    {
        Grundschule: 'grundschule',
        Hauptschule: 'hauptschule',
        Gesamtschule: 'gesamtschule',
        Realschule: 'realschule',
        Gymnasium: 'gymnasium',
        FRderschule: 'f_rderschule',
        Berufsschule: 'berufsschule',
        Mittelschule: 'mittelschule',
        Oberschule: 'oberschule',
        Sekundarschule: 'sekundarschule',
        Stadtteilschule: 'stadtteilschule',
        Berufsfachschule: 'berufsfachschule',
        Fachoberschule: 'fachoberschule',
        Berufsoberschule: 'berufsoberschule',
        Oberstufenzentrum: 'oberstufenzentrum',
        Fachschule: 'fachschule',
        Abendschule_VHS: 'abendschule_vhs',
        Berufskolleg: 'berufskolleg',
        BeruflichesGymnasium: 'beruflichesgymnasium',
        Uni_Studienkolleg: 'uni_studienkolleg',
        Auslandsschule: 'auslandsschule',
        Privatschule: 'privatschule',
        Other: 'other',
    } as unknown as typeof SchoolType,
    (k) => `lernfair.schooltypes.${k}`,
    (k) => <IconLoader iconPath={`schooltypes/icon_${k}.svg`} />
);

type SchoolTypeSelectorProps = SelectorProps<SchoolType> & {
    grade?: number;
};

export const SchoolTypeSelector = (props: SchoolTypeSelectorProps) => {
    const { grade, ...selectorProps } = props;
    const allSchoolTypes = Object.values(SchoolType);
    const availableSchoolTypes = grade ? getSchoolTypesForGrade(grade) : allSchoolTypes;

    return EnumSelector(
        availableSchoolTypes.reduce((acc, curr) => {
            acc[curr] = curr;
            return acc;
        }, {} as Record<string, string>) as unknown as typeof SchoolType,
        (k) => `lernfair.schooltypes.${k}`,
        (k) => <></>
    )(selectorProps);
};
