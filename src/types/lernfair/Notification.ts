export type UserNotification = {
    id: number;
    message: Message;
    sentAt: string;
};

export type Message = {
    headline: string;
    body: string;
    type: MessageType;
    navigateTo?: string;
};

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
