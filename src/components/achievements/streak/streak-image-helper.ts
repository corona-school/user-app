import { StreakImageSize } from '../types';

const getStreakImageSize = (size: StreakImageSize) => {
    switch (size) {
        case StreakImageSize.SMALL:
            return '52px';
        case StreakImageSize.MEDIUM:
            return '120px';
        case StreakImageSize.LARGE:
            return '180px';
        default:
            return '120px';
    }
};

const getStreakTextOffset = (size: StreakImageSize) => {
    switch (size) {
        case StreakImageSize.SMALL:
            return '-4px';
        case StreakImageSize.MEDIUM:
            return '-8px';
        case StreakImageSize.LARGE:
            return '-12px';
        default:
            return '-8px';
    }
};

const getStreakFontSize = (size: StreakImageSize) => {
    switch (size) {
        case StreakImageSize.SMALL:
            return '12px';
        case StreakImageSize.MEDIUM:
            return '32px';
        case StreakImageSize.LARGE:
            return '48px';
        default:
            return '32px';
    }
};

export { getStreakImageSize, getStreakTextOffset, getStreakFontSize };
