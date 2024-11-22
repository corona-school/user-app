import { State } from '@/gql/graphql';
import { EnumSelector } from './EnumSelector';
import { IconLoader } from './IconLoader';

export const LocationSelector = EnumSelector(
    State,
    (k) => `lernfair.states.${k}`,
    (k) => <IconLoader iconPath={`states/icon_${k}.svg`} />
);
