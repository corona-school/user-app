import { SchoolType } from '@/gql/graphql';
import { EnumSelector } from './EnumSelector';
import { IconLoader } from './IconLoader';

export const SchoolTypeSelector = EnumSelector(
    {
        Grundschule: 'grundschule',
        Hauptschule: 'hauptschule',
        Gesamtschule: 'gesamtschule',
        Realschule: 'realschule',
        Gymnasium: 'gymnasium',
        FRderschule: 'f_rderschule',
        Berufsschule: 'berufsschule',
        Other: 'other',
    } as unknown as typeof SchoolType,
    (k) => `lernfair.schooltypes.${k}`,
    (k) => <IconLoader iconPath={`schooltypes/icon_${k}.svg`} />
);
