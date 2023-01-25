import { NotificationMessage } from '../../gql/graphql';

export type Message = NotificationMessage;

export enum MessageType {
    CHAT = 'chat',
    SURVEY = 'survey',
    APPOINTMENT = 'appointment',
    ADVICE = 'advice',
    SUGGESTION = 'suggestion',
    ACCOUNCEMENT = 'announcement',
    CALL = 'call',
    ERROR = 'error',
}

export enum MarketingMessageType {
    NEWS = 'news',
    EVENT = 'event',
    REQUEST = 'request',
    ALTERNATIVE = 'alternative',
}
