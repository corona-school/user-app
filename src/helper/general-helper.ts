export const createReadableDate = (date: string, excludeTimeOfDay: boolean = false): string => {
    return `${date.substring(0, 10).split('-').reverse().join('.')}${!excludeTimeOfDay ? `, ${date.substring(11, 16)}` : ''}`;
};
