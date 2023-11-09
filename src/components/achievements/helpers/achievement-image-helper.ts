import { PolaroidImageSize, PuzzleImageSize, ShineOffset, ShineSize } from '../types';

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

const getShineSize = (isMobile?: boolean, isTablet?: boolean, isCard?: boolean) => {
    if (isMobile && !isTablet) {
        if (isCard) {
            return ShineSize.XSMALL;
        }
        return ShineSize.SMALL;
    } else if (isTablet && !isMobile) {
        return ShineSize.MEDIUM;
    } else if (!isTablet && !isMobile) {
        return ShineSize.LARGE;
    }
    return ShineSize.MEDIUM;
};

function getShineOffset(size: ShineSize): ShineOffset {
    switch (size) {
        case ShineSize.XSMALL:
            return ShineOffset.XSMALL;
        case ShineSize.SMALL:
            return ShineOffset.SMALL;
        case ShineSize.MEDIUM:
            return ShineOffset.MEDIUM;
        case ShineSize.LARGE:
            return ShineOffset.LARGE;
        default:
            return ShineOffset.MEDIUM;
    }
}

const getPuzzleSize = (isMobile?: boolean, isTablet?: boolean) => {
    if (isMobile && !isTablet) {
        return PuzzleImageSize.SMALL;
    } else if (isTablet && !isMobile) {
        return PuzzleImageSize.MEDIUM;
    } else if (!isTablet && !isMobile) {
        return PuzzleImageSize.LARGE;
    }
    return PuzzleImageSize.MEDIUM;
};

const getPuzzleBorderRadius = (size: PuzzleImageSize) => {
    switch (size) {
        case PuzzleImageSize.SMALL:
            return '2px';
        case PuzzleImageSize.MEDIUM:
            return '3px';
        case PuzzleImageSize.LARGE:
            return '4px';
    }
};

export { getPolaroidImageSize, getPolaroidBorderRadius, getPolaroidOffset, getShineSize, getShineOffset, getPuzzleSize, getPuzzleBorderRadius };
