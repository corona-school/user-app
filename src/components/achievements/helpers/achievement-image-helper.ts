import { PolaroidImageSize, PuzzleImageSize, ShineOffset, ShineSize } from '../types';

const breakpoints = {
    base: 0,
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1280,
};

const getPolaroidImageSize = (breakpoint?: number, isLarge?: boolean) => {
    if ((breakpoint === breakpoints.base || breakpoint === breakpoints.sm) && !isLarge) {
        return PolaroidImageSize.SMALL;
    } else if (breakpoint === breakpoints.md || ((breakpoint === breakpoints.base || breakpoint === breakpoints.sm) && isLarge)) {
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

const getShineSize = (breakpoint: number, isCard?: boolean) => {
    if (breakpoint === breakpoints.base || breakpoint === breakpoints.sm) {
        if (isCard) {
            return ShineSize.XSMALL;
        }
        return ShineSize.SMALL;
    } else if (breakpoint === breakpoints.md) {
        return ShineSize.MEDIUM;
    } else if (breakpoint === breakpoints.lg || breakpoint === breakpoints.xl) {
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

const getPuzzleSize = (breakpoint: number, isLarge?: boolean) => {
    if ((breakpoint === breakpoints.base || breakpoint === breakpoints.sm) && !isLarge) {
        return PuzzleImageSize.SMALL;
    } else if (breakpoint === breakpoints.md || (breakpoint === (breakpoints.base || breakpoints.sm) && isLarge)) {
        return PuzzleImageSize.MEDIUM;
    } else if ((breakpoint !== breakpoints.base || breakpoint !== breakpoints.sm || breakpoint !== breakpoints.md) && isLarge) {
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

export { breakpoints, getPolaroidImageSize, getPolaroidBorderRadius, getPolaroidOffset, getShineSize, getShineOffset, getPuzzleSize, getPuzzleBorderRadius };
