enum InformationType {
    community = 'community',
    book = 'book',
    appointment = 'appointment',
}

export function getImportantInformationIcon(informationType: InformationType) {
    switch (informationType) {
        case InformationType.community:
            return 'community';
        case InformationType.book:
            return 'book';
        case InformationType.appointment:
            return 'appointment';
        default:
            return null;
    }
}
