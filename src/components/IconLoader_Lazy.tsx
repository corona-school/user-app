// As this is lazily loaded from IconLoader.tsx, the suite of Icons will be bundled in a separate chunk
// With that the size of the main bundle is reduced by about 30%,
// and showing the icons is not mandatory functionality,
// thus users can use the app even while the icons are loading

import { CircleIcon } from 'native-base';

// DO NOT USE THIS DIRECTLY, only use the <IconLoader />!
export default function _IconLoaderLazy({ iconPath }: { iconPath: string }) {
    try {
        const Res = require(`../assets/icons/lernfair/${iconPath}`).default;
        return <Res />;
    } catch (e) {}
    return <CircleIcon size={'30px'} color="lightText" />;
}
