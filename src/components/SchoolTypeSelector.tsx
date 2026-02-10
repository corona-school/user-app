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
                // SchoolType.Beruflichesgymnasium,
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
                // SchoolType.Beruflichesgymnasium,
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
        Stadtteilschule: 'stadtteilschule',
        Berufsfachschule: 'berufsfachschule',
        Fachoberschule: 'fachoberschule',
        Berufsoberschule: 'berufsoberschule',
        Oberstufenzentrum: 'oberstufenzentrum',
        Fachschule: 'fachschule',
        Abendschule_VHS: 'abendschule_vhs',
        Berufskolleg: 'berufskolleg',
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
    console.log(allSchoolTypes);
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
