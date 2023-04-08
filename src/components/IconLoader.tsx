import { CircleIcon } from 'native-base';
import { Suspense } from 'react';
import { lazyWithRetry } from '../lazy';

const IconLoaderLazy = lazyWithRetry(() => import('./IconLoader_Lazy'));

export function IconLoader({ iconPath }: { iconPath: string }) {
    return (
        <Suspense fallback={<CircleIcon size={'30px'} color="lightText" />}>
            <IconLoaderLazy iconPath={iconPath} />
        </Suspense>
    );
}
