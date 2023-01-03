export type UserNotification = {
    id: number;
    message: Message;
    sentAt: string;
};

type Message = {
    headline: string;
    body: string;
    messageType: MessageType;
    navigateTo?: string;
    isUrlExternal?: boolean;
    error?: string;
};

export enum MessageType {
    CHAT = 'chat',
    SURVEY = 'survey',
    APPOINTMENT = 'appointment',
    ADVICE = 'advice',
    SUGGESTION = 'suggestion',
    ACCOUNCEMENT = 'announcement',
    CALL = 'call',
}

export enum MarketingMessageType {
    NEWS = 'news',
    EVENT = 'event',
    REQUEST = 'request',
    ALTERNATIVE = 'alternative',
}
