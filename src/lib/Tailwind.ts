import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-size': ['text-form', 'text-detail', 'text-subtle', 'text-xs', 'text-sm', 'text-base', 'text-medium', 'text-lg', 'text-xl'],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return customMerge(clsx(inputs));
}
