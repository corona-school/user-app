import { SchoolType } from '@/gql/graphql';
import { EnumSelector } from './EnumSelector';
import { IconLoader } from './IconLoader';

export const SchoolTypeSelector = EnumSelector(
    SchoolType,
    (k) => `lernfair.schooltypes.${k}`,
    (k) => <IconLoader iconPath={`schooltypes/icon_${k}.svg`} />
);
