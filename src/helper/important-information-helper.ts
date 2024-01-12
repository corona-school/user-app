export enum InformationType {
    COMMUNITY = 'community',
    BOOK = 'book',
    APPOINTMENT = 'appointment',
}

export function getImportantInformationIcon(informationType: InformationType) {
    switch (informationType) {
        case InformationType.COMMUNITY:
            return 'community';
        case InformationType.BOOK:
            return 'book';
        case InformationType.APPOINTMENT:
            return 'appointment';
        default:
            return null;
    }
}
