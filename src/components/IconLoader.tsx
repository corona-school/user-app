import { CircleIcon } from 'native-base';
import { Suspense } from 'react';
import { lazyWithRetry } from '../lazy';

const IconLoaderLazy = lazyWithRetry(() => import('./IconLoader_Lazy'));

export function IconLoader({ icon, iconPath }: { icon?: string; iconPath?: string }) {
    return (
        <Suspense fallback={<CircleIcon size={'30px'} color="lightText" />}>
            {icon ? <IconLoaderLazy icon={icon} /> : <IconLoaderLazy iconPath={iconPath} />}
        </Suspense>
    );
}
