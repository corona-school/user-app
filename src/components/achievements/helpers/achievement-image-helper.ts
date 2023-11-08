import { PolaroidImageSize, ShineSize } from '../types';

const getPolaroidImageSize = (isMobile?: boolean, isTablet?: boolean, isLarge?: boolean) => {
    if (isMobile && !isLarge) {
        return PolaroidImageSize.SMALL;
    } else if (isTablet || (isMobile && isLarge)) {
        return PolaroidImageSize.MEDIUM;
    } else if (isLarge) {
        return PolaroidImageSize.LARGE;
    }
    return PolaroidImageSize.MEDIUM;
};

const getPolaroidBorderRadius = (size: PolaroidImageSize) => {
    switch (size) {
        case PolaroidImageSize.SMALL:
            return '2px';
        case PolaroidImageSize.MEDIUM:
            return '3px';
        case PolaroidImageSize.LARGE:
            return '4px';
    }
};

const getPolaroidOffset = (size: PolaroidImageSize) => {
    switch (size) {
        case PolaroidImageSize.SMALL:
            return '0px';
        case PolaroidImageSize.MEDIUM:
            return '-20px';
        case PolaroidImageSize.LARGE:
            return '-40px';
    }
};

const getShineSize = (isMobile?: boolean, isTablet?: boolean) => {
    if (isMobile && !isTablet) {
        return ShineSize.SMALL;
    } else if (isTablet && !isMobile) {
        return ShineSize.MEDIUM;
    } else if (!isTablet && !isMobile) {
        return ShineSize.LARGE;
    }
    return ShineSize.MEDIUM;
};

export { getPolaroidImageSize, getPolaroidBorderRadius, getPolaroidOffset, getShineSize };
