import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-size': ['text-form'],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return customMerge(clsx(inputs));
}