import { FC } from 'react';
import EventIcon from '../assets/icons/icon_ereignis.svg';
import BooksIcon from '../assets/icons/icon_buch.svg';
import MoreIcon from '../assets/icons/Icon_Einzel.svg';
import { Important_Information_Category_Enum } from 'gql/graphql';

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
    WELCOME = 'willkommen',
    VERIFY = 'verifizierung',
    GET_FAMILIAR = 'kennenlernen',
    PUPIL_FIRST_SCREENING = 'pupilFirstScreening',
    PUPIL_SCREENING = 'pupilScreening',
    INTEREST_CONFIRMATION = 'interestconfirmation',
    STATUS_PUPIL = 'statusSchüler',
    STATUS_STUDENT = 'statusStudent',
    PASSWORD = 'passwort',
    CONTACT_PUPIL = 'kontaktSchüler',
    CONTACT_STUDENT = 'kontaktStudent',
    CERTIFICATE_OF_CONDUCT = 'zeugnis',
    TUTORING_CERTIFICATE = 'angeforderteBescheinigung',
    COURSE_OFFER = 'kursAnbieten',
    NEW_MATCH = 'neueLernunterstützung',
    DEFAULT = 'default',
}

export const getNextStepIcon = (label: NextStepLabelType): FC => {
    const icon = nextStepIcon.hasOwnProperty(label) ? nextStepIcon[label] : nextStepIcon[NextStepLabelType.DEFAULT];
    return icon;
};

export const getImportantInformationLabel = (label: Important_Information_Category_Enum): string => {
    switch (label) {
        case Important_Information_Category_Enum.Important:
            return 'Wichtig';
        case Important_Information_Category_Enum.Event:
            return 'Veranstaltung';
        case Important_Information_Category_Enum.HighDemand:
            return 'Hoher Bedarf';
        case Important_Information_Category_Enum.Feedback:
            return 'Feedback';
        case Important_Information_Category_Enum.FeatureUpdate:
            return 'Neue Funktionen';
        case Important_Information_Category_Enum.HolidayInfo:
            return 'Ferien-Info';
        case Important_Information_Category_Enum.News:
            return 'Lern-Fair News';
        default:
            return 'Information';
    }
};

export const nextStepIcon: { [label: string]: FC } = {
    willkommen: EventIcon,
    verifizierung: BooksIcon,
    kennenlernen: BooksIcon,
    pupilScreening: BooksIcon,
    interestconfirmation: MoreIcon,
    statusSchüler: MoreIcon,
    statusStudent: MoreIcon,
    passwort: MoreIcon,
    kontaktSchüler: MoreIcon,
    kontaktStudent: MoreIcon,
    zeugnis: MoreIcon,
    angeforderteBescheinigung: BooksIcon,
    default: BooksIcon,
};
