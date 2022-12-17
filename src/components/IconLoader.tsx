import { CircleIcon } from 'native-base';
import { lazy, Suspense } from 'react';

const IconLoaderLazy = lazy(() => import('./IconLoader_Lazy'));

export function IconLoader({ iconPath }: { iconPath: string }) {
    return (
        <Suspense fallback={<CircleIcon size={'30px'} color="lightText" />}>
            <IconLoaderLazy iconPath={iconPath} />
        </Suspense>
    );
}
