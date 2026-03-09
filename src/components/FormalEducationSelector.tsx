import { EnumSelector } from './EnumSelector';

export enum FormalEducationEnum {
    teacher = 'teacher',
    specialEducationTeacher = 'specialEducationTeacher',
    earlyChildhoodEducator = 'earlyChildhoodEducator',
    socialWorker = 'socialWorker',
    childAndAdolescentPsychologist = 'childAndAdolescentPsychologist',
    other = 'other',
}

export const FormalEducationSelector = EnumSelector(FormalEducationEnum, (k) => `formalEducation.${k}`);
