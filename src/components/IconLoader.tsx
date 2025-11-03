import { Suspense } from 'react';
import { lazyWithRetry } from '../lazy';
import { IconQuestionMark } from '@tabler/icons-react';

const IconLoaderLazy = lazyWithRetry(() => import('./IconLoader_Lazy'));

export function IconLoader({ icon, iconPath, className }: { icon?: string; iconPath?: string; className?: string }) {
    return (
        <Suspense fallback={<IconQuestionMark className={className ?? 'size-6'} />}>
            {icon ? <IconLoaderLazy icon={icon} className={className} /> : <IconLoaderLazy iconPath={iconPath} className={className} />}
        </Suspense>
    );
}
