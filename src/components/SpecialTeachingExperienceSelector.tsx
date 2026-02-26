import { EnumSelector } from './EnumSelector';
import { TeachingExperienceLevelEnum } from './TeachingExperienceLevelSelector';

export enum SpecialTeachingExperienceEnum {
    daz = 'daz',
    adhd = 'adhd',
    dyslexia = 'dyslexia',
    dyscalculia = 'dyscalculia',
    autismSpectrumDisorder = 'autismSpectrumDisorder',
    emotionalAndSocialDevelopment = 'emotionalAndSocialDevelopment',
    giftedness = 'giftedness',
    visualImpairment = 'visualImpairment',
    hearingImpairment = 'hearingImpairment',
    traumaSensitivePedagogy = 'traumaSensitivePedagogy',
    other = 'other',
}

interface SplitSpecialExperienceResult {
    specialTeachingExperience: SpecialTeachingExperienceEnum[];
    freeText?: string;
    teachingExperienceLevel: {
        '1:1'?: TeachingExperienceLevelEnum;
        group?: TeachingExperienceLevelEnum;
    };
}

export const splitSpecialExperience = (mixedValues: (SpecialTeachingExperienceEnum | string)[]): SplitSpecialExperienceResult => {
    const result: SplitSpecialExperienceResult = {
        specialTeachingExperience: [],
        teachingExperienceLevel: {},
    };
    mixedValues.forEach((value) => {
        if (Object.values(SpecialTeachingExperienceEnum).includes(value as SpecialTeachingExperienceEnum)) {
            result.specialTeachingExperience.push(value as SpecialTeachingExperienceEnum);
        }
        if (value.endsWith(' 1:1')) {
            result.teachingExperienceLevel['1:1'] = value.replace(' 1:1', '') as TeachingExperienceLevelEnum;
        } else if (value.endsWith(' group')) {
            result.teachingExperienceLevel.group = value.replace(' group', '') as TeachingExperienceLevelEnum;
        } else if (value.startsWith(`${SpecialTeachingExperienceEnum.other}:`)) {
            result.freeText = value.replace(`${SpecialTeachingExperienceEnum.other}:`, '');
        }
    });
    return result;
};

export const combineSpecialExperience = (
    specialTeachingExperience: SpecialTeachingExperienceEnum[],
    freeText: string | undefined,
    teachingExperienceLevel: { '1:1'?: TeachingExperienceLevelEnum; group?: TeachingExperienceLevelEnum }
): string[] => {
    const combinedValues: string[] = [...specialTeachingExperience];
    if (teachingExperienceLevel['1:1']) {
        combinedValues.push(`${teachingExperienceLevel['1:1']} 1:1`);
    }
    if (teachingExperienceLevel.group) {
        combinedValues.push(`${teachingExperienceLevel.group} group`);
    }
    if (freeText) {
        combinedValues.push(freeText);
    }
    return combinedValues;
};

export const SpecialTeachingExperienceSelector = EnumSelector(SpecialTeachingExperienceEnum, (k) => `specialTeachingExperience.${k}`);
