import { EnumSelector } from './EnumSelector';

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

export const SpecialTeachingExperienceSelector = EnumSelector(SpecialTeachingExperienceEnum, (k) => `specialTeachingExperience.${k}`);
