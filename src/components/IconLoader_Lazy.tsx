// As this is lazily loaded from IconLoader.tsx, the suite of Icons will be bundled in a separate chunk
// With that the size of the main bundle is reduced by about 30%,
// and showing the icons is not mandatory functionality,
// thus users can use the app even while the icons are loading

import { IconQuestionMark } from '@tabler/icons-react';
import { languageList } from '@/I18n';

import {
    AL,
    AM,
    AZ,
    BA,
    BG,
    CN,
    DE,
    ES,
    FR,
    GB,
    IR,
    KZ,
    PL,
    PT,
    TR,
    UA,
    VN,
    RU,
    IT,
    RO,
    EE,
    GE,
    GR,
    NG,
    IL,
    IN,
    HR,
    CD,
    LT,
    MK,
    NL,
    RS,
    SK,
    SO,
    TJ,
    TH,
    ER,
    CZ,
    HU,
    PK,
    ET,
    IQ,
    PS,
} from 'country-flag-icons/react/1x1';

const languageIcons = {
    sq: AL, // Albanian -> Albania
    am: ET, // Amharic -> Ethiopia
    ar: PS, // Arabic -> Palestine
    hy: AM, // Armenian -> Armenia
    az: AZ, // Azerbaijani -> Azerbaijan
    bs: BA, // Bosnian -> Bosnia
    bg: BG, // Bulgarian -> Bulgaria
    zh: CN, // Chinese -> China
    de: DE, // German -> Germany
    en: GB, // English -> Great Britain
    et: EE, // Estonian -> Estonia
    fr: FR, // French -> France
    ka: GE, // Georgian -> Georgia
    el: GR, // Greek -> Greece
    ha: NG, // Hausa -> Nigeria
    he: IL, // Hebrew -> Israel
    hi: IN, // Hindi -> India
    it: IT, // Italian -> Italy
    kk: KZ, // Kazakh -> Kazakhstan
    hr: HR, // Croatian -> Croatia
    ku: IQ, // Kurdish -> Iraq
    ln: CD, // Lingala -> Congo
    lt: LT, // Lithuanian -> Lithuania
    ml: IN, // Malayalam -> India
    mk: MK, // Macedonian -> North Macedonia
    nl: NL, // Dutch -> Netherlands
    fa: IR, // Persian -> Iran
    pl: PL, // Polish -> Poland
    pt: PT, // Portuguese -> Portugal
    ro: RO, // Romanian -> Romania
    ru: RU, // Russian -> Russia
    sr: RS, // Serbian -> Serbia
    sk: SK, // Slovak -> Slovakia
    so: SO, // Somali -> Somalia
    es: ES, // Spanish -> Spain
    tg: TJ, // Tajik -> Tajikistan
    th: TH, // Thai -> Thailand
    ti: ER, // Tigrinya -> Eritrea
    cs: CZ, // Czech -> Czech Republic
    tr: TR, // Turkish -> Turkey
    uk: UA, // Ukrainian -> Ukraine
    hu: HU, // Hungarian -> Hungary
    ur: PK, // Urdu -> Pakistan
    vi: VN, // Vietnamese -> Vietnam
};

// DO NOT USE THIS DIRECTLY, only use the <IconLoader />!
export default function _IconLoaderLazy({ icon, iconPath, className }: { icon?: string; iconPath?: string; className?: string }) {
    try {
        if (icon) {
            const item = languageList.find((item) => item.long === icon || item.short === icon)!;
            const Icon = languageIcons[item?.short as keyof typeof languageIcons];
            if (Icon) return <Icon className={className ?? `rounded-full h-7 w-7 border`} />;
        }
        if (iconPath) {
            const Res = require(`../assets/icons/lernfair/${iconPath}`).default;
            return <Res />;
        }
    } catch (e) {}
    return <IconQuestionMark className={className ?? 'size-6'} />;
}
