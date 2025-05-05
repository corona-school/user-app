// As this is lazily loaded from IconLoader.tsx, the suite of Icons will be bundled in a separate chunk
// With that the size of the main bundle is reduced by about 30%,
// and showing the icons is not mandatory functionality,
// thus users can use the app even while the icons are loading

import { CircleIcon } from 'native-base';
import { languageList, languageIcons } from '@/I18n';

// DO NOT USE THIS DIRECTLY, only use the <IconLoader />!
export default function _IconLoaderLazy({ icon, iconPath }: { icon?: string; iconPath?: string }) {
    try {
        if (icon) {
            const item = languageList.find((item) => item.long === icon)!;
            const Icon = languageIcons[item?.short as keyof typeof languageIcons];
            if (Icon) return <Icon className={`rounded-full h-7 w-7 border`} />;
        }
        if (iconPath) {
            const Res = require(`../assets/icons/lernfair/${iconPath}`).default;
            return <Res />;
        }
    } catch (e) {}
    return <CircleIcon size={'30px'} color="lightText" />;
}
