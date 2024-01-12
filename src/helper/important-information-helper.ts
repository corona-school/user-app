import { FC } from 'react';
import EventIcon from '../assets/icons/icon_ereignis.svg';
import BooksIcon from '../assets/icons/icon_buch.svg';
import MoreIcon from '../assets/icons/Icon_Einzel.svg';

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

export enum NextStepLabelType {
    WILLKOMMEN = 'willkommen',
    VERIFIZIERUNG = 'verifizierung',
    KENNENLERNEN = 'kennenlernen',
    PUPIL_SCREENING = 'pupilScreening',
    INTEREST_CONFIRMATION = 'interestconfirmation',
    STATUS_PUPIL = 'statusSchüler',
    STATUS_STUDENT = 'statusStudent',
    STATUS_STUDENT_TWO = 'statusStudent2',
    PASSWORT = 'passwort',
    CONTACT_PUPIL = 'kontaktSchüler',
    CONTACT_STUDENT = 'kontaktStudent',
    ZEUGNIS = 'zeugnis',
    TUTORING_CERTIFICATE = 'angeforderteBescheinigung',
    DEFAULT = 'default',
}

export const getNextStepIcon = (label: NextStepLabelType): FC => {
    const icon = nextStepIcon.hasOwnProperty(label) ? nextStepIcon[label] : nextStepIcon[NextStepLabelType.DEFAULT];
    return icon;
};

export const nextStepIcon: { [label: string]: FC } = {
    willkommen: EventIcon,
    verifizierung: BooksIcon,
    kennenlernen: BooksIcon,
    pupilScreening: BooksIcon,
    interestconfirmation: MoreIcon,
    statusSchüler: MoreIcon,
    statusStudent: MoreIcon,
    statusStudent2: MoreIcon,
    passwort: MoreIcon,
    kontaktSchüler: MoreIcon,
    kontaktStudent: MoreIcon,
    zeugnis: MoreIcon,
    angeforderteBescheinigung: BooksIcon,
    default: BooksIcon,
};
