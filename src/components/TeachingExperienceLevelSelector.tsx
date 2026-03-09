import { EnumSelector } from './EnumSelector';

export enum TeachingExperienceLevelEnum {
    none = 'none',
    some = 'some',
    extensive = 'extensive',
}

export const TeachingExperienceLevelSelector = EnumSelector(TeachingExperienceLevelEnum, (k) => `teachingExperienceLevel.${k}`);
